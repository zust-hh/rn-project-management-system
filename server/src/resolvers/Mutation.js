const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

signup = async (parent, args, context, info) => {
    const password = await bcrypt.hash(args.password, 10)
    const user = await context.prisma.createUser({ ...args, password })

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user,
    }
}

login = async (parent, args, context, info) => {
    let user = await context.prisma.users({
        where: {
            idNumber: args.idNumber
        }
    });
    user = user[0];

    if (!user) {
        throw new Error('No such user found')
    }

    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) {
        throw new Error('Invalid password')
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user,
    }
}

collectionProject = async (root, args, context, info) => {
    const userId = getUserId(context)
    const { projectId } = args

    return context.prisma.updateProject({
        where: { id: projectId },
        data: {
            favoriteUser: {
                connect: {
                    id: userId
                }
            }
        }
    })
}

followUser = async (root, args, context, info) => {
    const userId = getUserId(context)
    const { followUserId } = args

    return context.prisma.updateUser({
        where: { id: userId },
        data: {
            follow: {
                connect: {
                    id: followUserId
                }
            }
        }
    })
}

sendMessage = async (root, args, context, info) => {
    const userId = getUserId(context)
    const { userIdArr, article } = args

    let unreadIdArr = []
    userIdArr.map((id) => {
        unreadIdArr.push({
            id
        })
    })

    return context.prisma.createMessage({
        article,
        addBy: {
            connect: {
                id: userId
            }
        },
        unread: {
            connect: unreadIdArr
        }
    })
}

changeSteps = async (root, args, context, info) => {
    const { steps } = args

    steps.map(async (step) => {
        stepObj = JSON.parse(step);
        let data = {}
        if (stepObj.name) {
            data.name = stepObj.name
        }
        if (stepObj.chargeId) {
            data.charge = {
                connect: {
                    id: stepObj.chargeId
                }
            }
        }
        if (stepObj.state) {
            data.state = stepObj.state
        }
        await context.prisma.updateStep({
            where: { id: stepObj.id },
            data
        })
    })

    return true;
}

module.exports = {
    signup,
    login,
    collectionProject,
    followUser,
    sendMessage,
    changeSteps
}