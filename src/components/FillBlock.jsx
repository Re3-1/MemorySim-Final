export function FillBlock({ percentage = 30, color = 'bg-green-500' }){
    return  <div className="relative w-full max-w-sm bg-gray-300  h-20 overflow-hidden border-2">
      <div
        className={`absolute top-0 left-0 h-full ${color}`}
        style={{ width: `${percentage}%` }}
      />
      <span className="relative z-10 text-sm text-center w-full inline-block text-white">
        {percentage}%
      </span>
    </div>
}