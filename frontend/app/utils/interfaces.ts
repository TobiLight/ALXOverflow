export interface IUser {
	id?: string
	email: string
	first_name?: string
	last_name?: string
	username: string
	bio: string
}

export interface Question {
	id: string
	title: string
	content: string
	created_at: string
	updated_at: string
	answers?: []
	author_id: string
	author?: IUser
}

export interface IAnswer {
	id: string
	content: string
	created_at: Date
	updated_at: Date
	author_id: string
	author?: IUser
	question_id: string
	question: Question
}