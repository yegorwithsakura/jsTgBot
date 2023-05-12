const TelegramApi = require('node-telegram-bot-api')
const {gameOptions,againOptions}=require('./options')
const token='6289762091:AAEXXg9YZ0sG14QV0LYf-E97salvP1x37J8'

const bot=new TelegramApi(token,{polling:true})

const chats={}


const startGame=async(chatId)=>{
    await bot.sendMessage(chatId,'Сейчас я загадаю цифру от 0 до 9, а вы должны ее отгадать')
    const randomNumber=Math.floor (Math.random()*10)
    chats[chatId]=randomNumber;
    await bot.sendMessage(chatId,'Отгадывайте!',gameOptions)
}

const start=()=>{
    bot.setMyCommands([
        {command:'/start',description:'Начальное приветсвие'},
        {command:'/info',description:'Получить информацию'},
        {command:'/game',description:'Поиграем?'},
    ])
    
    bot.on('message',async msg=>{
        const text=msg.text;
        const chatId=msg.chat.id;
    
        if(text==='/start'){
            await bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/d97/c1e/d97c1e8a-943c-37c4-963f-8db69b18db05/10.webp')
            return bot.sendMessage(chatId,'Добро пожаловать в телеграм бота полностью написанного на js')
        }
        if(text==='/info'){
            return bot.sendMessage(chatId,'Тебя зовут: '+msg.from.first_name)
        }
        if(text==='/game'){
           return startGame(chatId)
        }
        return bot.sendMessage(chatId,'Я вас не понял, пользуйтесь известными мне командами')
    })

    bot.on('callback_query',msg=>{
        const data=msg.data;
        const chatId=msg.message.chat.id;
        if(data==='/again'){
            return startGame(chatId)
        }
        if(data===chats[chatId]){
            return bot.sendMessage(chatId,'Поздравляю, вы отгадали цифру '+chats[chatId],againOptions)
        }else{
            return bot.sendMessage(chatId,'К сожалению вы не угадали, бот загадал: '+chats[chatId],againOptions)
        }
        bot.sendMessage(chatId,'Вы выбрали: '+data)
    })
}

start()