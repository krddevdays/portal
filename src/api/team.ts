import * as fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import { z } from 'zod'

const teamDirectoryPath = path.join(process.cwd(), '/src/data/team')

const schema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    avatar: z.string().url(),
    bio: z.string().optional().nullable(),
    jobName: z.string().optional().nullable(),
    jobPosition: z.string().optional().nullable(),
    telegram: z.string(),
    email: z.string().email().optional().nullable(),
})

export type OrgTeamMember = z.infer<typeof schema>

let orgTeamMembers: readonly OrgTeamMember[] | null = null

export function getOrgTeamMembers(): readonly OrgTeamMember[] {
    if (orgTeamMembers !== null) {
        return orgTeamMembers
    }

    const fileNames = fs.readdirSync(teamDirectoryPath)

    return (orgTeamMembers = fileNames.map((fileName) => {
        const fullPath = path.join(teamDirectoryPath, fileName)
        const id = fileName.replace(/\.md$/, '')
        const file = fs.readFileSync(fullPath, 'utf-8')
        const matterResult = matter(file)

        return schema.parse({
            id,
            ...matterResult.data,
            bio: matterResult.content,
        })
    }))
}
