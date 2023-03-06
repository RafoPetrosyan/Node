import {Users, Cities, Countries} from "../models";

async function main() {
    await Cities.sync({alter: true});
    await Countries.sync({alter: true});
    await Users.sync({alter: true});

    process.exit(0);
}

main();