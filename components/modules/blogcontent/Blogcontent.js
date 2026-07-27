const Blogcontent = ({ content }) => {
  return (
    <div className="space-y-6 font-vazir text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
      {content.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p key={index} className="mb-4">
                {block.text}
              </p>
            )
          case 'heading':
            const HeadingTag = `h${block.level}`
            return (
              <HeadingTag 
                key={index} 
                className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4"
              >
                {block.text}
              </HeadingTag>
            )
          case 'image':
            return (
              <figure key={index} className="my-10 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={block.src}
                  alt={block.alt}
                  width={1000}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </figure>
            )
          default:
            return null
        }
      })}
    </div>
  )
}