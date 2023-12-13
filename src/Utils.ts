///<reference lib="dom"/>

export class Utils {
  static generateId() {
    let id = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < 32; i++) {
      id += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return id;
  }
}
