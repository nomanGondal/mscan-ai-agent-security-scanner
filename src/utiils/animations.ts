const underlineAnimation = `
  relative
  rounded-none
  cursor-pointer
  bg-transparent
  hover:bg-transparent
  active:bg-transparent
  focus:bg-transparent
  text-black
  shadow-none
  transition-all
  duration-300
  before:content-['']
  before:absolute
  before:left-0
  before:bottom-0
  before:h-[1px]
  before:w-0
  before:bg-black
  before:transition-all
  before:duration-300
  hover:before:w-full
  border-none
  pb-3
  font-normal
`

export { underlineAnimation }
