const TelegramApi = require('node-telegram-bot-api')
const {gameOptions,againOptions}=require('./options')
const token='6289762091:AAEXXg9YZ0sG14QV0LYf-E97salvP1x37J8'
const sequelize=require('./db')
const UserModel=require('./models')
const bot=new TelegramApi(token,{polling:true})

const chats={}


const startGame=async(chatId)=>{
    await bot.sendMessage(chatId,'Сейчас я загадаю цифру от 0 до 9, а вы должны ее отгадать')
    const randomNumber=Math.floor (Math.random()*10)
    chats[chatId]=randomNumber;
    await bot.sendMessage(chatId,'Отгадывайте!',gameOptions)
}

const start=async()=>{
    try{
        await sequelize.authenticate()
        await sequelize.sync()
    }catch(e){
        console.log('Подключение сломалось к дб',e);
    }

    bot.setMyCommands([
        {command:'/start',description:'Начальное приветсвие'},
        {command:'/info',description:'Получить информацию'},
        {command:'/game',description:'Поиграем?'},
    ])
    
    bot.on('message',async msg=>{
        const text=msg.text;
        const chatId=msg.chat.id;

        try{
            if(text==='/start'){
                await UserModel.create({chatId})
                await bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/d97/c1e/d97c1e8a-943c-37c4-963f-8db69b18db05/10.webp')
                return bot.sendMessage(chatId,'Добро пожаловать в телеграм бота полностью написанного на js')
            }
            if(text==='/info'){
                const user =await UserModel.findOne({chatId})
                return bot.sendMessage(chatId,'Тебя зовут: '+msg.from.first_name+' Правильных ответов: '+user.right+' Неправильных ответов: '+user.wrong)
            }
            if(text==='/game'){
               return startGame(chatId)
            }
            return bot.sendMessage(chatId,'Я вас не понял, пользуйтесь известными мне командами')

        }catch(e){
            return bot.sendMessage(chatId,'Произошла какая-то ошибочка!')
        }  
    })

    bot.on('callback_query',async msg=>{
        const data=msg.data;
        const chatId=msg.message.chat.id;
        if(data==='/again'){
            return startGame(chatId)
        }

        const user=await UserModel.findOne({chatId})
        
        if(data==chats[chatId]){
            user.right+=1
            await bot.sendMessage(chatId,'Поздравляю, вы отгадали цифру '+chats[chatId],againOptions)
        }else{
            user.wrong+=1
            await bot.sendMessage(chatId,'К сожалению вы не угадали, бот загадал: '+chats[chatId],againOptions)
        }
        await user.save();
    })
}

start()