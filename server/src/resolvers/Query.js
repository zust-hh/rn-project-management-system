const { APP_SECRET, getUserId } = require('../utils')

projectList = async (root, args, context, info) => {
    // const userId = getUserId(context);
    const where = args.filter ? {
        OR: [
            { description_contains: args.filter },
            { name_contains: args.filter },
            { addBy: {
                idNumber_contains: args.filter
            } }
        ],
    } : {}
    const projects = await context.prisma.projects({
        where,
        skip: args.skip,
        first: args.first,
        orderBy: args.orderBy,
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
    projectList,
}