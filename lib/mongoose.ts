import mongoose from 'mongoose'

let isConnected = false
const mongoDB = process.env.MONGODB_URI

export const connectToDB = async () => {
  mongoose.set('strictQuery', true)

  if (!mongoDB) return console.error('MONGODB_URI is not defined')

  if (isConnected) return console.log('-> using existing database connection')

  try {
    await mongoose.connect(mongoDB)

    isConnected = true

    console.log('MongoDB Connected')
  } catch (error) {
    console.error(error)
  }
}
