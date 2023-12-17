"use strict";
var ps = require("prompt-sync");
const prompt2 = ps();
// Ask the usernpm i --save-dev @types/prompt-syn four bits of input: Do you want to : Show/Add/Delete or Quit?
let mainMenuHeader = "Main Menu \n\n";
let add_item_menu = "Type \'add\' to add an item.";
let delete_item_menu = "Type \'delete\' to delete an item.";
let view_item_menu = "Type \'view\' to all items.";
let quit_menu = "Type \'Q\' to quit.";
// This is for bringing the user back to the main menu
let go_back_menu = "Type \'back\' to go back to the main menu.";
let mainMenu = `${mainMenuHeader}\n ${add_item_menu} \n ${delete_item_menu} \n ${view_item_menu} \n\n ${go_back_menu} \n\Enter 'stock' to see items in stock to buy.\n\nEnter 'checkout' to checkout. ${quit_menu} \n\n`;
class Shop {
    constructor(stock) {
        this.stock = {};
        this.users = [];
        this.stock = stock;
    }
    viewStock() {
        let inStock = "\n\n";
        for (let product in stock) {
            inStock += product + " ";
            let item = stock[product];
            for (let key in item) {
                inStock += "\n" + String(key) + "  " + item[key];
            }
            inStock += "\n\n";
        }
        console.log(inStock + "\n\n");
        prompt2("press any key to continue...");
    }
    add_user(user) {
        this.users.push(user);
    }
}
class User {
    constructor(_userType = "customer", _name, _pasword, _shop) {
        this.cart = {};
        this.shop = _shop;
    }
    addToShoppingCart(cart) {
        let item = prompt2("Enter the name of the item you like to add.");
        if (item != null) {
            prompt2(`${this.shop.stock[item]}`);
            if (this.shop.stock[item] != undefined) {
                let _amount = prompt2("Enter how many you will like to add you your cart.");
                if (typeof _amount == null) {
                    prompt2("please enter amount as a number next time. Press any key to continue.");
                }
                else {
                    let amountNum = parseInt(String(_amount));
                    let itemType = this.shop.stock[item];
                    if (amountNum != null) {
                        if (itemType.amount >= amountNum) {
                            if (cart[item] != undefined) {
                                cart[item] = { name: itemType.name, description: itemType.description, amount: cart[item].amount + amountNum, price: itemType.price };
                            }
                            else {
                                cart[item] = { name: itemType.name, description: itemType.description, amount: amountNum, price: itemType.price };
                            }
                            this.shop.stock[item].amount -= amountNum;
                            prompt2(`${cart[item]["amount"]} ${item}(s) added to your cart.`);
                        }
                        else {
                            prompt2(`That quantity of ${item} is not in stock. Press any key to continue`);
                        }
                    }
                }
            }
            else {
                prompt2("We do not have that item in stock.  Press any key to continue.");
            }
        }
    }
    deleteItem(cart) {
        let item = prompt2("Enter the item you you like to add");
        if (item != null) {
            if (item in cart) {
                delete (cart[item]);
                prompt2(`${item} has beeen removed for your cart. Press any key to continue.`);
            }
        }
        this.shopMenu(cart);
    }
    viewCart(cart, checkingOut) {
        let reciept = "\n\n";
        for (let product in cart) {
            reciept += product + ":\n";
            let item = cart[product];
            for (let key in item) {
                reciept += String(key) + "  " + item[key] + "\n";
            }
            reciept += "\n\n";
        }
        prompt2("Your items are" + reciept + "\n\n" + "Press any key to continue...");
        let total = 0;
        for (let product in cart) {
            total += cart[product]["amount"] * cart[product]["price"];
        }
        prompt2("Your total is $" + total + "\n\n" + "Press any key to continue...");
        if (checkingOut == false) {
            this.shopMenu(cart);
        }
    }
    shopMenu(cart) {
        let command = prompt2(mainMenu);
        switch (command) {
            case "add": {
                this.addToShoppingCart(cart);
                this.shopMenu(cart);
                break;
            }
            case "delete": {
                this.deleteItem(cart);
            }
            case "view": {
                this.viewCart(cart, false);
            }
            case "Q": {
                this.cart = {};
                break;
            }
            case "quit": {
                this.cart = {};
                break;
            }
            case "q": {
                this.cart = {};
                break;
            }
            case "stock": {
                this.shop.viewStock();
                this.shopMenu(cart);
                break;
            }
            case "checkout": {
                this.viewCart(cart, true);
                break;
            }
            default: {
                prompt2("I didn't quiet get that. Press any enter to continue.");
                this.shopMenu(cart);
            }
        }
    }
}
let stock = { "banana": {
        name: "banana", amount: 20, description: "oragnic bananas", price: .25
    },
    "apple": {
        name: "apple", amount: 20, description: "oragnic apples", price: .50
    },
    "orange": {
        name: "orange", amount: 20, description: "oragnic oranges", price: .45
    },
};
stock["cheese"] = { name: "chedar", description: "12oz chedar", amount: 35, price: 5.00 };
const store = new Shop(stock);
let dave = new User("customer", "dave", "sneaky", store);
dave.shopMenu(dave.cart);
