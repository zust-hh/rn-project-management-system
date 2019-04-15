const { APP_SECRET, getUserId } = require('../utils')

projectList = async (root, args, context, info) => {
    const userId = getUserId(context);
    let where = args.filter ? {
        OR: [
            { description_contains: args.filter },
            { name_contains: args.filter },
            {
                addBy: {
                    idNumber_contains: args.filter
                }
            }
        ],
    } : {};
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

    if (userId) {
        const myProjects = await context.prisma.user({
            id: userId
        }).addByProjects();

        const myFavoriteProjects = await context.prisma.user({
            id: userId
        }).favorite();

        if (args.attribution) {
            projects = myProjects
        }

        return {
            projects,
            myFavoriteProjects,
            count
        }
    }

    return {
        projects,
        myFavoriteProjects: [],
        count
    }


}

module.exports = {
    projectList,
}