interface IUser {
    id: string;
    login: string;
    password: string;
    online: boolean;
    verified: boolean;
    phoneNumber: string;
    age: number;
    cardNumber: string;
    country: string;
    balance: number;
    transactions: ITransaction[]
}

interface ITransaction {
    senderId: string;
    receiverId: string;
    money: number;
    status: string;
}
interface IResponse {
  status: number;
  text: string;
  message: string
}
const users: User[] = [];

/////
class User implements IUser{
    id = ''
    login = ''
    password = ''
    online = false
    verified = false
    phoneNumber = ''
    age =  0
    cardNumber: ''
    country: ''
    balance: 0
    transactions: []
    
    constructor(login: string, password: string){
       this.id =  this.generateID()
       this.password = password
       this.login = login
    }
    signUp(login: string, password: string, repeatPassword: string): IResponse {
        const existingUser = users.find((user) => user.login === login);
        if (existingUser) {
            return { status: 400, text: "Ошибка", message: "Имя пользователя уже существует" };
        }
        // Проверка наличия пользователя с таким логином\\
    
        if (login.length < 6 || password.length < 6) {
            return { status: 400, text: "Ошибка", message: "Длина имени пользователя и пароля должна составлять не менее 6 символов" };
        }
        // Проверка длины логина и пароля\\
    
        const loginRegex = /^[a-zA-Z0-9]+$/;
        if (!loginRegex.test(login)) {
            return { status: 400, text: "Ошибка", message: "Имя пользователя не должно содержать специальных символов" };
        }
        // Проверка отсутствия специальных символов в логине\\

        // Проверка отсутствия специальных символов в логине\\
    
        users.push(new User(login, password));
        this.generateID()
        // Вызов функции авторизации\\
        return this.signIn(login, password);
    }
    generateID(): string {
        return Math.random().toString(36).substring(2);
    }
    signIn(login: string, password: string): IResponse {
        // Поиск пользователя по логину и паролю\\
        const user = users.find((user) => user.login === login && user.password === password);
        if (user) {
            // Установка статуса "online" для пользователя\\
            user.online = true;
            return { status: 200, text: "OK", message: "Успешно зарегистрирован" };
        } else {
            return { status: 401, text: "Неавторизирован", message: "Неверное имя пользоватля или пароль" };
        }
    }

    verify(login: string, password: string, phoneNumber: string, age: number, cardNumber: string, country: string): IResponse {
        // Поиск текущего пользователя (если пользователь уже авторизован)\\
        const currentUser: IUser | undefined = users.find((user) => user.login = login);
    
        // Проверка наличия текущего пользователя\\
        if (!currentUser) {
            return { status: 401, text: "Неавторизирован", message: "Пользователь не зарегистрирован" };
        }
    
        // Обновление параметров верификации\\
        currentUser.phoneNumber = phoneNumber;
        currentUser.age = age;
        currentUser.cardNumber = cardNumber;
        currentUser.country = country;
        currentUser.verified = true;
    
        return { status: 200, text: "OK", message: "Проверка прошла успешно" };
    }
    forgetPwd(phoneNumber: string, password: string): IResponse {
        // Поиск пользователя по номеру телефона и паролю\\
        const user = users.find((user) => user.phoneNumber === phoneNumber && user.password === password);
    
        if (user) {
            return { status: 200, text: "OK", message: "Пароль сброшен" };
        } else {
            return { status: 401, text: "Неавторизирован", message: "Неверное имя пользоватля или пароль" };
        }
    }
    transactionTrigger(id: string, receiverId: string, money: number): IResponse {
        // Поиск текущего пользователя ( если пользователь уже авторизован)\\
        const currentUser = users.find((user) => user.id == id);
    
        // Проверка наличия текущего пользователя\\
        if (currentUser) {
                  // Поиск получателя операции\\
                  const receiver = users.find((user) => user.id === receiverId);
    
                  // Проверка наличия получателя\\
                  if (!receiver) {
                   return { status: 404, text: "Не найден", message: "Получатель не найден" };
                   }
    
        // Проверка деняк отправителя и получателя\\
        if (currentUser.balance < money || receiver.balance < money) {
            return { status: 400, text: "Ошибка", message: "Недостаточно средств" };
        }
    
        // Создание новой операции\\
        const newTransaction: ITransaction = {
            senderId: currentUser.id,
            receiverId,
            money,
            status: "Ожидайте",
        };
        
        this.transactions.push(newTransaction);
    
        return { status: 200, text: "OK", message: "Операция прошла успешно" };
        } else{
           return { status: 401, text: "Неавторизирован", message: "Пользователь не зарегистрирован" };
        }
    
 
    }
    transactionReceive(transactionId: string): any {
        // Поиск текущего пользователя (если пользователь уже авторизован)\\
        const currentUser = users.find((user) => user.online);
    
        // Проверка наличия текущего пользователя\\
        if (!currentUser) {
            return { status: 401, text: "Неавторизирован", message: "Пользователь не зарегистрирован" };
        }
    
        // Поиск операции по идентификатору\\
        const transaction = transactions.find((transaction) => transaction.id === transactionId);
    
        // Проверка наличия операции\\
        if (!transaction) {
            return { status: 404, text: "Не найден", message: "Операция не найдена" };
        }
    
        // Проверка деняк отправителя и получателя\\
        if (currentUser.balance < transaction.money || receiver.balance < transaction.money) {
            return { status: 400, text: "Ошибка", message: "Недостаточно средств" };
        }
    
        // Обновление статуса операции\\
        transaction.status = "Завершен";
    
        // Добавление операции в историю пользователей \\
    
        currentUser.transactions.push(transaction);
        receiver.transactions.push(transaction);
    
        return { status: 200, text: "OK", message: "Операция успешно получена" };
    }
    
   
}
/////
