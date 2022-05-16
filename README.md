# y3llow.xyz

A mix between the yellow pages and buymeacoffee but decentralized & powered by Astro & Ceramic.
[Astro](https://astro.build) Hackathon 2022 submission for the `Best project built with SSR` category.
## Pre-requisites
- `node` version installed `>= 15.0.1`
- `npm` version installed `>= 7.20.6`
- [Metamask](https://metamask.io/) browser extension installed (required to interact with the blockchain)
- Create a new [Alchemy](https://www.alchemy.com) project
- Create a new [Infura](https://infura.io) project
- Create a new [Supabase](https://supabase.com) project

### Store the transactions in a PostgreSQL database & generate an API with Supabase
- In your Supabase project, create a table named `transactions` with the following schema :

| name       	| data type               	| format     	|
|------------	|-------------------------	|------------	|
| id            | bigint                    | int8          |
| created_at 	| timestamp with timezone 	| timestampz 	|
| from       	| character varying       	| varchar       |
| to         	| character varying       	| varchar       |
| hash         	| character varying       	| varchar       |
| explorer_link | character varying       	| varchar       |
| amount        | character varying       	| varchar       |
| token_name    | character varying       	| varchar       |
| message       | text                  	| text          |
| name          | text                  	| text          |

### Environment variables
- At the root of your project, copy the content of `.env.dist` in a new `.env` file
- Add the env variables values

## Get started
- Install dependencies with `npm install`
- Launch the project with `npm run dev`

