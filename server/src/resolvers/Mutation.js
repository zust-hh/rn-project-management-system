const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

post = (root, args, context, info) => {
    const userId = getUserId(context)
    return context.prisma.createProject({
        name: args.name,
        description: args.description,
        addBy: { connect: { id: userId } },
    })
}

signup = async (parent, args, context, info) => {
    // 1
    const password = await bcrypt.hash(args.password, 10)
    // 2
    const user = await context.prisma.createUser({ ...args, password })

    // 3
    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    // 4
    return {
        token,
        user,
    }
}

login = async (parent, args, context, info) => {
    // 1
    const user = await context.prisma.user({ studentId: args.studentId })
    if (!user) {
        throw new Error('No such user found')
    }

    // 2
    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) {
        throw new Error('Invalid password')
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    // 3
    return {
        token,
        user,
    }
}

module.exports = {
    signup,
    login,
    post,
}