// "use client"

// import { useState, useEffect } from "react"
// import { motion, AnimatePresence } from "framer-motion"

// interface Word {
//   text: string
//   className?: string
// }

// interface TypewriterEffectProps {
//   words: Word[]
//   className?: string
// }

// export function TypewriterEffect({ words, className = "" }: TypewriterEffectProps) {
//   const [currentWordIndex, setCurrentWordIndex] = useState(0)
//   const [currentText, setCurrentText] = useState("")
//   const [isDeleting, setIsDeleting] = useState(false)

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       const currentWord = words[currentWordIndex].text
      
//       if (!isDeleting) {
//         if (currentText.length < currentWord.length) {
//           setCurrentText(currentWord.slice(0, currentText.length + 1))
//         } else {
//           setIsDeleting(true)
//           setTimeout(() => {}, 2000)
//         }
//       } else {
//         if (currentText.length > 0) {
//           setCurrentText(currentText.slice(0, -1))
//         } else {
//           setIsDeleting(false)
//           setCurrentWordIndex((prev) => (prev + 1) % words.length)
//         }
//       }
//     }, isDeleting ? 50 : 100)

//     return () => clearTimeout(timeout)
//   }, [currentText, isDeleting, currentWordIndex, words])

//   return (
//     <div className={`inline-flex ${className}`}>
//       <span className={words[currentWordIndex].className}>
//         {currentText}
//       </span>
//       <motion.span
//         animate={{ opacity: [1, 0, 1] }}
//         transition={{ duration: 0.8, repeat: Infinity }}
//         className="w-[2px] h-8 bg-primary ml-1"
//       />
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface Word {
  text: string
  className?: string
}

interface TypewriterEffectProps {
  words: Word[]
  className?: string
}

export function TypewriterEffect({
  words,
  className = "",
}: TypewriterEffectProps) {

  const [mounted, setMounted] = useState(false)

  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const currentWord = words[currentWordIndex].text

    const timeout = setTimeout(() => {

      if (!isDeleting) {

        if (currentText.length < currentWord.length) {
          setCurrentText(
            currentWord.slice(0, currentText.length + 1)
          )
        } else {

          setTimeout(() => {
            setIsDeleting(true)
          }, 2000)

        }

      } else {

        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setCurrentWordIndex(
            (prev) => (prev + 1) % words.length
          )
        }

      }

    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)

  }, [
    currentText,
    isDeleting,
    currentWordIndex,
    words,
    mounted
  ])

  if (!mounted) return null

  return (
    <div className={`inline-flex ${className}`}>
      <span className={words[currentWordIndex].className}>
        {currentText}
      </span>

      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
        }}
        className="w-[2px] h-8 bg-primary ml-1"
      />
    </div>
  )
}