import { map } from "nanostores"

type User = {
    address: string
}

export const $user = map<User>({
    address: "0x",
})
