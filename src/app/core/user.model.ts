export class UserModel{
    constructor(
        public id?: number,
        public email?: string,
        public first_name?: string,
        public last_name?: string,
        public phone?: string,
        public image_id?: number,
        public address?: string,
        public category?:string,
        public in_game?:string
    ){}
}