/**
 * VIVA Business Team — Dynamic Page SEO Hook
 *
 * Updates page title and meta description reflecting local search intent
 * across Kottakkal, Malappuram, and Kerala.
 */

import { useEffect } from "react"

export interface PageSeoOptions {
  title: string
  description?: string
}

export function usePageSeo({ title, description }: PageSeoOptions) {
  useEffect(() => {
    // 1. Update Document Title
    const originalTitle = document.title
    document.title = title

    // 2. Update Meta Description
    if (description) {
      let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (!metaDesc) {
        metaDesc = document.createElement("meta")
        metaDesc.name = "description"
        document.head.appendChild(metaDesc)
      }
      metaDesc.content = description
    }

    return () => {
      document.title = originalTitle
    }
  }, [title, description])
}
