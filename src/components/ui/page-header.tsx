"use client"

import { Badge } from "@/components/ui/badge"

const PageHeader = ({title, description, length}: {title: string, description: string, length?: number}) => {
    return (
        <div className="grid gap-2">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <h1 className="text-xl font-bold sm:text-2xl">{title}</h1>
                {typeof length === "number" && <Badge className="rounded-full">{length}</Badge>}
            </div>
            <p className="text-sm text-muted-foreground sm:text-base">
                {description}
            </p>
        </div>
    )
}

export default PageHeader
