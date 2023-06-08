import sql from './db.js'
console.log(await sql`select starelid from pg_statistic limit 1`);

// spar-resultGrid
//
// for each:
//
// spar-productBox__title--main
// .text()
//
// spar-productBox__price--priceUnit
// \(\d+[,\d]\)  // (123,45€)

export let bar = () => console.log('b');
