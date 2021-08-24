export type ExpectedObject = {
  name: string
  age: number
  isEmployee: boolean
  salary: number
  projects: [string, string, string]
}

export const input = `
  [
    (2) {
      name
      age
      ...extra
      projects: [
        ...prevProjects
        lastProject
      ]
    }
  ]
`

export const context = {
  name: 'John Doe',
  age: 33,
  lastProject: 'mockpiler',
  prevProjects: ['galaxy.js', 'realtime-storage'] as [string, string],
  extra: {
    isEmployee: true,
    salary: 10000
  }
}
