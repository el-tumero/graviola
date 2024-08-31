export type TransactionStatus =
    | "NONE"
    // Prepare transactions
    | "PREP_AWAIT_CONFIRM"
    | "PREP_REJECTED"
    | "PREP_WAIT" // waiting for VRF to be fulfilled
    | "PREP_READY"
    // Generate transactions
    | "GEN_AWAIT_CONFIRM"
    | "GEN_REJECTED"
    | "GEN_WAIT" // waiting for OAO to be fulfilled
    | "DONE"
    | "ERROR"
