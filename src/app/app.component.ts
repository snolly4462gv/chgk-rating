import { Component, OnInit } from '@angular/core';
import { UserModel } from "../app/core/user.model";
import { MainService } from "../app/core/main.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  isNewGame:boolean = true;
  Players:UserModel[] = [];
  Categories:string[] = [];
  QuestCount:number = 12;
  RaundCount:number = 3;
  TeamsCount:number = 0;
  GameMatrix:Array<number>; 
  GameRating:number[] = [];
  GameScore:number[] = [];
  GameInGameRating:number[] = [];
  GameAllQuestionRating:number[]=[];
  GameInGameQuestionRating:number[]=[];
  Result:string="";
  QFlag:boolean = false;
  QString:string = "";
  QCurr:number = 0;
  HaveResult:boolean = false;
  HaveResultCat:boolean = false;

  constructor(private service:MainService){}

  ngOnInit(){
    this.GetPlayers();
    this.GameMatrix = this.NewMatrixArray(this.TeamsCount,this.QuestCount*this.RaundCount,0);
  }

  NewMatrixArray(rows,columns,val){
    var arr = new Array();
    for(var i=0; i<rows; i++){
      arr[i] = new Array();
      for(var j=0; j<columns; j++){
        arr[i][j] = val;
      }
    }
    return arr;
  }
  
  CreateGame() {
    this.BuildTable();
    this.isNewGame = false;
  }

  GetPlayers(){
    this.Players = this.service.GetPlayers();
    this.TeamsCount = this.Players.length;
    //console.log(`players`,this.TeamsCount);
  }

  BuildTable(){
    var x = document.createElement("TABLE");
    x.setAttribute("id", "myTable");
    document.getElementById("START_PAGE").appendChild(x);

    var y = document.createElement("TR");
    y.setAttribute("id", "myTr");
    document.getElementById("myTable").appendChild(y);

    var z = document.createElement("TD");
    var t = document.createTextNode("ID");
    z.appendChild(t);
    document.getElementById("myTr").appendChild(z);

    var z = document.createElement("TD");
    var t = document.createTextNode("Название");
    z.appendChild(t);
    document.getElementById("myTr").appendChild(z);

    var z = document.createElement("TD");
    var t = document.createTextNode("Категория");
    z.appendChild(t);
    document.getElementById("myTr").appendChild(z);

    var z = document.createElement("TD");
    var t = document.createTextNode("Зачет");
    z.appendChild(t);
    document.getElementById("myTr").appendChild(z);

    for(let i=1;i<=this.QuestCount*this.RaundCount+3;i++){
      var z = document.createElement("TD");
      if(i%(this.QuestCount+1)!=0){
        let q = i - Math.floor(i/(this.QuestCount+1));
        z.setAttribute("id","cell_num_q_"+q);
        z.onclick = ()=>{
        this.QAnswer(i);
        };
      }

      if(i%(this.QuestCount+1)==0)
        var t = document.createTextNode("");
      else 
        var t = document.createTextNode(i%(this.QuestCount+1)+"");
        z.appendChild(t);
       
        
      document.getElementById("myTr").appendChild(z);
    }

    let count = 1;

    for(let player of this.Players){

      var y = document.createElement("TR");
      y.setAttribute("id", "myTr"+count);
      document.getElementById("myTable").appendChild(y);
      
      var z = document.createElement("TD");
      var t = document.createTextNode(player.id+"");
      z.setAttribute("id", "pl_id_"+count);
      z.appendChild(t);
      document.getElementById("myTr"+count).appendChild(z);

      var z = document.createElement("TD");
      var t = document.createTextNode(player.first_name+"");
      z.setAttribute("id", "pl_name_"+count);
      z.appendChild(t);
      document.getElementById("myTr"+count).appendChild(z);

      var z = document.createElement("TD");
      var t = document.createTextNode(player.category+"");
      z.setAttribute("id", "pl_cat_"+count);
      z.appendChild(t);
      document.getElementById("myTr"+count).appendChild(z);

      var z = document.createElement("TD");
      var t = document.createTextNode(player.in_game+"");
      z.setAttribute("id", "pl_ingame_"+count);
      z.appendChild(t);
      document.getElementById("myTr"+count).appendChild(z);


      //ответная таблица
      for(let i=1;i<=this.QuestCount*this.RaundCount+3;i++){
        var z = document.createElement("TD");
        
        if(i%(this.QuestCount+1)==0){
          z.setAttribute("id","cell_res_"+count+"_"+Math.floor(i/this.QuestCount));
          z.style.backgroundColor = "cornflowerblue";
          z.style.color = "white";
        }
        else 
        {
        let q= i -Math.floor(i/(this.QuestCount+1));
          z.setAttribute("id","cell_"+count+"_"+q);
        }

      //  var t = document.createTextNode(z.id);
       var t = document.createTextNode("");
        z.appendChild(t);
        if(i%(this.QuestCount+1)!=0)
        z.onclick = ()=>{
          this.tableClick(player.id,i);
        };
        document.getElementById("myTr"+count).appendChild(z);
      }
      count++;
    }
}

QAnswer(i:number){
 
  let q = i - Math.floor(i/(this.QuestCount+1));
  //console.log(i,q);
  if(this.QFlag&&q==this.QCurr||!this.QFlag){
  if(this.QFlag)
    document.getElementById("cell_num_q_"+q).style.backgroundColor="white";
  else 
  document.getElementById("cell_num_q_"+q).style.backgroundColor="red";
  this.QFlag = !this.QFlag;
  this.QString = "";
  this.QCurr = q;
}
}

QAnswerApl(){
  this.QString = this.QString.trim();
  let answers:string[] = this.QString.split(" ");
  for (let i=0;i<answers.length;i++){
    if(+answers[i]-1<this.GameMatrix.length){
      let player = +answers[i];
    this.GameMatrix[player-1][this.QCurr-1] = 1;
    document.getElementById("cell_"+player+"_"+this.QCurr).style.backgroundColor="#4CAF50";
    }
  }
  //console.log(this.GameMatrix);
  this.QAnswer(this.QCurr);
  this.GetResult();
}

QAllAdd(){
  for(let i=0;i<this.TeamsCount;i++){
    let player = i+1;
    this.GameMatrix[i][this.QCurr-1] = 1;
    document.getElementById("cell_"+player+"_"+this.QCurr).style.backgroundColor="#4CAF50";
  }
  this.QAnswer(this.QCurr);
  this.GetResult();
}

QAllDel(){
  for(let i=0;i<this.TeamsCount;i++){
    let player = i+1;
    this.GameMatrix[i][this.QCurr-1] = 0;
    document.getElementById("cell_"+player+"_"+this.QCurr).style.backgroundColor="white";
  }
  this.QAnswer(this.QCurr);
  this.GetResult();
}
 

tableClick(player,question) {
  let q = question-Math.floor(question/(this.QuestCount+1));
  //console.log(q);
    if (this.GameMatrix[player-1][q-1] == 0){ this.GameMatrix[player-1][q-1] = 1;
      document.getElementById("cell_"+player+"_"+q).style.backgroundColor="#4CAF50";
    }
    else { 
      this.GameMatrix[player-1][q-1] = 0;
      document.getElementById("cell_"+player+"_"+q).style.backgroundColor="white";
    }
    this.GetResult();
  }



  GetResult(){
  ////console.log(this.GameMatrix);
  //this.Result = "ok "+this.GameMatrix[0]+"   ("+this.SumArray(this.GameMatrix,0)+") ";
  this.GameScore = [];
  for (let j=1;j<=this.RaundCount;j++)
  for(let i=1;i<=this.TeamsCount;i++){
    
    document.getElementById("cell_res_"+i+"_"+j).removeChild( document.getElementById("cell_res_"+i+"_"+j).lastChild);
    var cell = document.getElementById("pl_id_"+i).textContent+"."+this.SumArray(this.GameMatrix,i-1,j-1);
    
    if(j>1)cell+=":"+this.SumArrayAll(this.GameMatrix,i-1,j);
    var t = document.createTextNode(cell+"");
    document.getElementById("cell_res_"+i+"_"+j).appendChild(t);

  }

  for(let i=0;i<this.TeamsCount;i++)
    this.GameScore[i] = this.SumArrayAll(this.GameMatrix,i,this.RaundCount);

  this.GetAllGameRating();
  this.GetInGameRating();

  this.AllResultTable();
  this.CategoryResultsTable();

  this.GetAnalisResult();

}

GetAllGameRating(){
  this.GameRating = [];
  for(let i=0;i<this.TeamsCount;i++)this.GameRating.push(0);
  for(let i=0;i<this.QuestCount*this.RaundCount;i++){
    let rtq = 0;
    for(let j=0;j<this.GameMatrix.length;j++){
      rtq+=this.GameMatrix[j][i];
    }
    rtq = this.TeamsCount -rtq + 1;
    this.GameAllQuestionRating[i] = rtq;
    for(let j=0;j<this.GameMatrix.length;j++){
     if(this.GameMatrix[j][i]==1)this.GameRating[j]+=rtq;
    }
  }
  //console.log(`rating Q`,this.GameAllQuestionRating);
 // this.Result = "  ||  "+ this.GameRating+"";
}

GetInGameRating(){
  this.GameInGameRating = [];
  var countInGame = 0;
  for(let i=1;i<=this.TeamsCount;i++)
    {if(document.getElementById("pl_ingame_"+i).textContent=="Да")
      {
        countInGame++;
      //console.log(`INGAME-------------`,i);
      }
      this.GameInGameRating.push(0);
    }
  for(let i=0;i<this.QuestCount*this.RaundCount;i++){
    let rtq = 0;
    for(let j=0;j<this.GameMatrix.length;j++){
      let u = j+1;
      if(document.getElementById("pl_ingame_"+u).textContent=="Да")
      rtq+=this.GameMatrix[j][i];
    }
    rtq =  countInGame -rtq + 1;
    this.GameInGameQuestionRating[i] = rtq;
    for(let j=0;j<this.GameMatrix.length;j++){
      let u = j+1;
      if(document.getElementById("pl_ingame_"+u).textContent=="Да")
     if(this.GameMatrix[j][i]==1)this.GameInGameRating[j]+=rtq;
    }
  }
  //this.Result += "  |  "+this.GameInGameRating+"";
 //console.log(`rating Q in Game`,this.GameInGameQuestionRating);
}

SumArray(arr:Array<number>,n,m){
  let sum = 0;
  for(let i=0;i<this.QuestCount;i++)
  {
    sum+=arr[n][i+m*this.QuestCount];
  }
  return sum;
}
SumArrayAll(arr:Array<number>,n,m){
  let sum = 0;
  for(let i=0;i<this.QuestCount*m;i++)
  {
    sum+=arr[n][i];
  }
  return sum;
}

AllResultTable(){
 // this.Result = "";

  for(let i=0;i<this.TeamsCount;i++){
    let u=i+1;
    var id = document.getElementById("pl_id_"+u).textContent;
    var ratingInGame = this.GameInGameRating[i]+"";
      if(!ratingInGame||ratingInGame=="undefined") ratingInGame = "";
    //this.Result += id+") Score:"+ " Rating: "+this.GameRating[i]+" "+ratingInGame+" || ";
  }

  if(this.HaveResult) for(let i=0;i<this.TeamsCount+1;i++)
  document.getElementById("resultTable").removeChild(document.getElementById("resultTable").lastChild);

  this.HaveResult = true;

  var y = document.createElement("TR");
  document.getElementById("resultTable").appendChild(y);
  y.setAttribute("id", "myResTr");

  var z = document.createElement("TD");
  var t = document.createTextNode("ID");
  z.appendChild(t);
  document.getElementById("myResTr").appendChild(z);
  
  var z = document.createElement("TD");
  var t = document.createTextNode("Name");
  z.appendChild(t);
  document.getElementById("myResTr").appendChild(z);

  var z = document.createElement("TD");
  var t = document.createTextNode("Score");
  z.appendChild(t);
  document.getElementById("myResTr").appendChild(z);

  var z = document.createElement("TD");
  var t = document.createTextNode("Rating");
  z.appendChild(t);
  document.getElementById("myResTr").appendChild(z);

  var z = document.createElement("TD");
  var t = document.createTextNode("AllRating");
  z.appendChild(t);
  document.getElementById("myResTr").appendChild(z);


  for(let i=0;i<this.TeamsCount;i++){
    let u=i+1;
    var id = document.getElementById("pl_id_"+u).textContent;
    var name = document.getElementById("pl_name_"+u).textContent;
    var score = this.GameScore[i]+"";
    var ratingInGame = this.GameInGameRating[i]+"";
    var ratingAll = this.GameRating[i]+"";
      if(!ratingInGame||ratingInGame=="undefined") ratingInGame = "";
    //this.Result += id+") Score:"+ " Rating: "+this.GameRating[i]+" "+ratingInGame+" || ";

    var y = document.createElement("TR");
    document.getElementById("resultTable").appendChild(y);
    y.setAttribute("id", "myResTr"+u);
  
    var z = document.createElement("TD");
    var t = document.createTextNode(id);
    z.appendChild(t);
    document.getElementById("myResTr"+u).appendChild(z);
    
    var z = document.createElement("TD");
    var t = document.createTextNode(name);
    z.appendChild(t);
    document.getElementById("myResTr"+u).appendChild(z);
  
    var z = document.createElement("TD");
    var t = document.createTextNode(score);
    z.appendChild(t);
    document.getElementById("myResTr"+u).appendChild(z);
  
    var z = document.createElement("TD");
    var t = document.createTextNode(ratingInGame);
    z.appendChild(t);
    document.getElementById("myResTr"+u).appendChild(z);
  
    var z = document.createElement("TD");
    var t = document.createTextNode(ratingAll);
    z.appendChild(t);
    document.getElementById("myResTr"+u).appendChild(z);
  
    // var z = document.createElement("TD");
    // var t = document.createTextNode("Rating");
    // z.appendChild(t);
    // document.getElementById("myResTr"+u).appendChild(z);
  
    // var z = document.createElement("TD");
    // var t = document.createTextNode("Rating");
    // z.appendChild(t);
    // document.getElementById("myResTr"+u).appendChild(z);






  }

  




}

CategoryResultsTable(){
  this.Categories = [];
  for(let i=1;i<=this.TeamsCount;i++){
    let ctg = document.getElementById("pl_cat_"+i).textContent;
    let notNew = false;
    for(let cc of this.Categories) if(cc==ctg) notNew = true;
     if(!notNew) this.Categories.push(ctg);
     }
     //console.log('cat',this.Categories);

    
     if(this.HaveResultCat) for(let i=0;i<this.Categories.length;i++)
     document.getElementById("CATEGOR_TABLES").removeChild(document.getElementById("CATEGOR_TABLES").lastChild);
    this.HaveResultCat = true;

   
     for(let k=0;k<this.Categories.length;k++){

          var x = document.createElement("TABLE");
          x.style.padding = "20px";
          x.style.margin = "20px";
          x.setAttribute("id", "myTableCat_"+k);
          document.getElementById("CATEGOR_TABLES").appendChild(x);

         
          var y = document.createElement("TR");
          document.getElementById("myTableCat_"+k).appendChild(y);
          y.setAttribute("id", "myResTrCat_"+k);
        
          var z = document.createElement("TD");
          var t = document.createTextNode("ID");
          z.appendChild(t);
          document.getElementById("myResTrCat_"+k).appendChild(z);

          var z = document.createElement("TD");
          var t = document.createTextNode("Name");
          z.appendChild(t);
          document.getElementById("myResTrCat_"+k).appendChild(z);

          var z = document.createElement("TD");
          var t = document.createTextNode("Score");
          z.appendChild(t);
          document.getElementById("myResTrCat_"+k).appendChild(z);

          var z = document.createElement("TD");
          var t = document.createTextNode("Rating");
          z.appendChild(t);
          document.getElementById("myResTrCat_"+k).appendChild(z);

          var z = document.createElement("TD");
          var t = document.createTextNode("AllRating");
          z.appendChild(t);
          document.getElementById("myResTrCat_"+k).appendChild(z);
          
        
        
          for(let i=0;i<this.TeamsCount;i++){
            let u=i+1;

            if(document.getElementById("pl_cat_"+u).textContent==this.Categories[k]){
            var id = document.getElementById("pl_id_"+u).textContent;
             var name = document.getElementById("pl_name_"+u).textContent;
             var score = this.GameScore[i]+"";
             

            var ratingAllCat = 0;
            var ratingCat = 0;
            var countCatEl = 0;
            var countCatAllEl = 0;


            //console.loglog(`\ncategory = `,k,`i = `,i);

            for(let t=0;t<this.TeamsCount;t++){
              let uu=t+1;
              if(document.getElementById("pl_cat_"+uu).textContent==this.Categories[k])
              {
                countCatAllEl++;
                if(document.getElementById("pl_ingame_"+uu).textContent=="Да")  countCatEl++;
              }
            }
            //console.loglog(`Элементы категории = `,countCatAllEl,` в зачёте = `,countCatEl);
            


            //по вопросам для данного i
            for(let q=0;q<this.QuestCount*this.RaundCount;q++){
              //если вопрос отвечен - смотри сколько ещё из данной категории на него ответили
              let tmp_count = 0;
              if(this.GameMatrix[i][q]==1){
                for(let t=0;t<this.TeamsCount;t++){
                  let uu=t+1;
                  if(document.getElementById("pl_cat_"+uu).textContent==this.Categories[k] && this.GameMatrix[t][q]==1)
                  tmp_count++;
                }
                tmp_count = countCatAllEl - tmp_count +1 ;
                ratingAllCat+=tmp_count;
              }
            }

            for(let q=0;q<this.QuestCount*this.RaundCount;q++){
              //если вопрос отвечен - смотри сколько ещё из данной категории на него ответили
              let tmp_count = 0;
              if(this.GameMatrix[i][q]==1){
                for(let t=0;t<this.TeamsCount;t++){
                  let uu=t+1;
                  if(document.getElementById("pl_cat_"+uu).textContent==this.Categories[k] && this.GameMatrix[t][q]==1 && (document.getElementById("pl_ingame_"+uu).textContent=="Да"))
                  tmp_count++;
                }
                tmp_count = countCatEl - tmp_count +1 ;
                ratingCat+=tmp_count;
              }
            }

            if(document.getElementById("pl_ingame_"+u).textContent!="Да") ratingCat = 0;



           
              


            
            var y = document.createElement("TR");
            document.getElementById( "myTableCat_"+k).appendChild(y);
            y.setAttribute("id", "myResTrCategory"+u);
          
            var z = document.createElement("TD");
            var t = document.createTextNode(id);
            z.appendChild(t);
            document.getElementById("myResTrCategory"+u).appendChild(z);

            var z = document.createElement("TD");
            var t = document.createTextNode(name);
            z.appendChild(t);
            document.getElementById("myResTrCategory"+u).appendChild(z);

            var z = document.createElement("TD");
            var t = document.createTextNode(score);
            z.appendChild(t);
            document.getElementById("myResTrCategory"+u).appendChild(z);

            var z = document.createElement("TD");
            var t = document.createTextNode(ratingCat+"");
            z.appendChild(t);
            document.getElementById("myResTrCategory"+u).appendChild(z);

            var z = document.createElement("TD");
            var t = document.createTextNode(ratingAllCat+"");
            z.appendChild(t);
            document.getElementById("myResTrCategory"+u).appendChild(z);

          }
            
            
          }

         
          
          
     
    }


}

GetAnalisResult(){
  this.Result = "RESULT: ";
  console.log("\n"); console.log("\n");
  for(let k=0;k<this.Categories.length;k++){
    this.Result+=(k+1)+") ";
    var tbl = document.getElementById("myTableCat_"+k);
    var id:number[]=[];
    var name:string[]=[];
    var score:number[]=[];
    var rating:number[]=[];
    for(let i=1;i<tbl.children.length;i++){
     id.push(+tbl.children[i].childNodes[0].textContent);
     name.push(tbl.children[i].childNodes[1].textContent+"");
     score.push(+tbl.children[i].childNodes[2].textContent);
     rating.push(+tbl.children[i].childNodes[3].textContent);
    }
    console.log(id,name,score,rating);
    
    let count = 0;
    while(count<score.length){
      console.log(`sc`,score);
      count++;
      let max = score[0],max_i=0;
      for(let i=0;i<score.length;i++){
        if(score[i]>max){max = score[i];max_i=i;}
      }
      this.Result+=id[max_i]+". "+name[max_i]+" "+score[max_i]+" ("+rating[max_i]+");  \n";
      score[max_i]=-1;
    }

    console.log("\n");
  
  }
}


}
