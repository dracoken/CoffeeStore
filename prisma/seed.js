const { PrismaClient } = require('@prisma/client');
const menu = require('../data/menu.json');

const prisma = new PrismaClient();

async function main() {
    for (const item of menu) {
        await prisma.menu.create({
            data: {
                name: item.title,
                grandePrice: item.pricing.grande,
                ventiPrice: item.pricing.venti
            }
        })
        console.log(`Created ${item.title} in the database!`)
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })