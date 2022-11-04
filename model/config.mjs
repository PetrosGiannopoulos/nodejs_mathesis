import 'dotenv/config'
import {Sequelize} from 'sequelize'

const sequelize = new Sequelize(
    {
        host: process.env.POSTGRES_HOST,
        //host: 'localhost',
        //port: 5432,
        port: 5432,
        //port: 5433,
        database: 'postgres',
        schema: 'booklist',
        dialect: 'postgres',
        //username: 'postgres',
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        
        //password: '123456!a',
        logging: false,
        define: {
            timestamps: false,
            freezeTableName: true
            
        }    

    });

export default sequelize