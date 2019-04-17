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
    let projects = await context.prisma.projects({
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

userList = async (root, args, context, info) => {
    const userId = getUserId(context);
    let where = args.filter ? {
        OR: [
            { name_contains: args.filter },
            { idNumber_contains: args.filter },
            {
                addByProjects_some: {
                    OR: [
                        { description_contains: args.filter },
                        { name_contains: args.filter },
                    ],
                }
            }
        ],
    } : {};
    let users = await context.prisma.users({
        where,
        skip: args.skip,
        first: args.first,
        orderBy: args.orderBy,
    })

    // 用于记录自己可能在的情况
    let myIndex = -1;

    const count = await context.prisma
        .usersConnection({
            where,
        })
        .aggregate()
        .count()

    if (userId) {
        for (let i = 0; i < users.length; i++) {
            if (users[i].id == userId) {
                myIndex = i;
            }
        }
        const myFollowUsers = await context.prisma.user({
            id: userId
        }).follow();

        if (myIndex !== -1) {
            users.splice(myIndex, 1);
        }

        return {
            users,
            myFollowUsers,
            count
        }
    }

    if (myIndex !== -1) {
        users.splice(myIndex, 1);
    }

    return {
        users,
        myFollowUsers: [],
        count
    }
}

getUserInfo = async (root, args, context, info) => {
    const myUserId = getUserId(context);
    let user = args.userId ? await context.prisma.user({
        id: args.userId
    }) : await context.prisma.user({
        id: myUserId
    })

    return user
}

module.exports = {
    projectList,
    userList,
    getUserInfo
}