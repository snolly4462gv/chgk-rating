import { Injectable } from "@angular/core";
import { UserModel } from "./user.model";


@Injectable()
export class MainService{

    private Players:UserModel[] = [];

    constructor(){
     this.setPlayers();
    }

    public GetPlayers(){
        return this.Players;
    }

    public setPlayers(){
      this.Players =
      [
        {
          "id": 1,
          "first_name": "Сборная ЕМЗ",
          "category": "Сотрудники",
          "in_game":"Да"
        },
        {
          "id": 2,
          "first_name": "Коксовый пирог",
           "category": "Сотрудники",
          "in_game":"Да"
        },
        {
          "id": 3,
          "first_name": "Стирол",
           "category": "Сотрудники",
           "in_game":"Да"
        },
        {
          "id": 4,
          "first_name": "Засядьковцы",
           "category": "Сотрудники",
          "in_game":"Да"
        },
        {
          "id": 5,
          "first_name": "Трубный случай",
           "category": "Сотрудники",
          "in_game":"Да"
        },
		{
          "id": 6,
          "first_name": "ХОЛЭГИ",
           "category": "Сотрудники",
          "in_game":"Да"
        },
		{
          "id": 7,
          "first_name": "Зуевская ТЭС",
           "category": "Сотрудники",
          "in_game":"Да"
        },
		{
          "id": 8,
          "first_name": "Фортуна",
           "category": "Сотрудники",
          "in_game":"Да"
        },
		{
          "id": 9,
          "first_name": "Магистраль",
           "category": "Сотрудники",
          "in_game":"Да"
        },
		{
          "id": 10,
          "first_name": "Локомотив",
           "category": "Сотрудники",
          "in_game":"Да"
        },
		{
          "id": 11,
          "first_name": "Энергия",
          "category": "Сотрудники",
          "in_game":"Да"
        },
		{
          "id": 12,
          "first_name": "ММЗ",
           "category": "Сотрудники",
          "in_game":"Да"
        },
		{
          "id": 13,
          "first_name": "Эрудиты",
          "category": "Сотрудники",
          "in_game":"Да"
        }
]
    }

}
