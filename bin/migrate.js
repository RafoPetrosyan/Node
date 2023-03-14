import {Users, Cities, Countries, People, Candidates} from "../models";

async function main() {
    // await Countries.sync({alter: true});
    // await Cities.sync({alter: true});
    // await Users.sync({alter: true});
    await People.sync({alter: true});
    await Candidates.sync({alter: true});

    process.exit(0);
}

main().catch(console.error);