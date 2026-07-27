import mongoose from 'mongoose'

const ConnectToDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log('✅ DB already connected')
      return
    } else {
      await mongoose.connect(process.env.MONGO_URL)
      console.log('✅ DB  connect')
    }
  } catch (error) {
    console.log('db connection has error', error)
  }
}

export default ConnectToDB
