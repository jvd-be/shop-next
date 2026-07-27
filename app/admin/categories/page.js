import Admincategorieswrapper from '@/components/templates/Admin/admincategorieswrapper/Admincategorieswrapper'
import Adminlayout from '@/components/templates/Admin/adminlayout/Adminlayout'
import Categorymodel from '@/model/Categorymodel'
export default async function page () {
  let categoryData
  try {
    categoryData = await Categorymodel.find().lean()
  } catch (error) {}

  const category = JSON.parse(JSON.stringify(categoryData))
  return (
    <Adminlayout>
      <Admincategorieswrapper category={category} />
    </Adminlayout>
  )
}
