feed = async (root, args, context, info) => {
    const where = args.filter ? {
        OR: [
            { description_contains: args.filter },
            { name_contains: args.fliter }
        ],
    } : {}
    const projects = await context.prisma.projects({
        where,
        skip: args.skip,
        first: args.first,
        orderBy: args.orderBy
    })
    const count = await context.prisma
        .projectsConnection({
            where,
        })
        .aggregate()
        .count()
    return {
        projects,
        count
    }
}

module.exports = {
    feed,
}