export interface ViewModel {
    AuthToken: string | null
    ErrorMessage: string | null
    HasMultipleAccounts: boolean
    LoginStatus: number
    SchoolId: number
    Token1: string | null
    Token2: string | null
    UserId: number
    UserIsStudent: boolean
    UserIsSub: boolean
}

export interface validateCredentials {
    IsAuthorized: boolean
    CallSucceeded: boolean
    StayOnSamePageWhenNotAuthorized: boolean
    ErrorMessages: string[]
    GeneralMessages: string[]
    ViewModel: ViewModel
    RedirectTo: string | null
    MessageTimeout: number
    CurrentUserId: number
    CurrentUserIsAdmin: boolean
    CurrentUserIsSubstitute: boolean
    FileName: string | null
    token: string
}