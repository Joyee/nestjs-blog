import { DataSourceOptions } from 'typeorm';

const config: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '12345678',
  database: 'blog',
  synchronize: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
};

export default config;
