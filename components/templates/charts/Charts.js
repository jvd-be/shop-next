import Graph from '@/components/modules/Admin/graph/Graph'
import Piechart from '@/components/modules/Admin/piechart/Piechart'

export default function Charts ({ revenueData, bestData }) {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10'>
      {/* نمودار خطی */}
      <Graph revenueData={revenueData}/>
    <Piechart bestData={bestData}/>
      {/* نمودار دایره‌ای */}

    </div>
  )
}
