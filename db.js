const {Sequelize}=require('sequelize')

module.exports=new Sequelize(
    'tg_bot',
    'root',
    'sakura',
    {
        host:'master.9d89fdb5-2c57-4690-bcc0-7609ac81e7c7.c.dbaas.selcloud.ru',
        port:'5432',
        dialect: 'postgres'
    }
)