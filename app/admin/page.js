import Adminmainpagewrapper from '@/components/templates/Admin/adminmainpagewrapper/Adminmainpagewrapper'
import ConnectToDB from '../lib/mongodb'
import Usermodel from '@/model/Usermodel'
import ProductModel from '@/model/ProductModel'
import Ordermodel from '@/model/Ordermodel'
import Blogmodel from '@/model/Blogmodel'

const persianMonths = [
 'دی',        // ژانویه (اکثر روزهاش دی‌ماهه)
  'بهمن',      // فوریه
  'اسفند',     // مارس
  'فروردین',   // آوریل
  'اردیبهشت',  // مه
  'خرداد',     // ژوئن
  'تیر',       // جولای
  'مرداد',     // آگوست
  'شهریور',    // سپتامبر
  'مهر',       // اکتبر
  'آبان',      // نوامبر
  'آذر'        // دسامبر
]

// مجموع کاربران ثبت‌نام‌شده در هر ماهِ یک سال میلادی مشخص
async function getMonthlyUserCounts (year) {
  const start = new Date(year, 0, 1)
  const end = new Date(year + 1, 0, 1)

  const result = await Usermodel.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lt: end }
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' }, // ۱ تا ۱۲ (میلادی)
        total: { $sum: 1 }
      }
    }
  ])

  const map = {}
  result.forEach(item => {
    map[item._id - 1] = item.total // تبدیل به ایندکس صفرمبنا
  })
  return map
}

export default async function Adminmain () {
  let userCount = 0, productsCount = 0, orderCount = 0, articleCount = 0
  let lastMonthUserCount = 0, lastMonthProductsCount = 0, lastMonthArticleCount = 0, lastMonthOrderCount = 0
  let usersData = []

  try {
    await ConnectToDB()

    const now = new Date()
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

    ;[
      userCount, productsCount, articleCount, orderCount,
      lastMonthUserCount, lastMonthProductsCount, lastMonthArticleCount, lastMonthOrderCount
    ] = await Promise.all([
      Usermodel.countDocuments({}),
      ProductModel.countDocuments({}),
      Blogmodel.countDocuments({ isActive: true }),
      Ordermodel.countDocuments({}),
      Usermodel.countDocuments({ createdAt: { $lte: endOfLastMonth } }),
      ProductModel.countDocuments({ createdAt: { $lte: endOfLastMonth } }),
      Blogmodel.countDocuments({ isActive: true, createdAt: { $lte: endOfLastMonth } }),
      Ordermodel.countDocuments({ createdAt: { $lte: endOfLastMonth } })
    ])

    // تعداد کاربران جدید هر ماه از ابتدای سال جاری تا الان
    const currentYear = now.getFullYear()
    const monthlyUsers = await getMonthlyUserCounts(currentYear)

    const currentMonthIndex = now.getMonth() // ۰ تا ۱۱
    usersData = persianMonths.slice(0, currentMonthIndex + 1).map((name, index) => ({
      name,
      'کاربران جدید': monthlyUsers[index] || 0
    }))

  } catch (error) {
    console.log('Admin dashboard data error:', error)
  }

  return (
    <div>
      <Adminmainpagewrapper
        userCount={userCount}
        productsCount={productsCount}
        orderCount={orderCount}
        articleCount={articleCount}
        lastMonthUserCount={lastMonthUserCount}
        lastMonthProductsCount={lastMonthProductsCount}
        lastMonthOrderCount={lastMonthOrderCount}
        lastMonthArticleCount={lastMonthArticleCount}
        usersData={usersData}
      />
    </div>
  )
}