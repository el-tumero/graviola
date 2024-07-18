import { test, expect } from "@playwright/test"
import { deploy, oaoMockResponse } from "./helpers"

test.beforeAll(async () => {
    console.log("Contract deployment")
    await deploy()
})

test("Basic Generate test", async ({ page }) => {
    await page.goto("/")
    const devButton = await page.getByTestId("dev-btn")
    await devButton.click()
    await expect(devButton).toHaveCSS("color", "rgb(22, 163, 74)")
    await page.getByTestId("generate-nav-btn").click()
    await expect(page).toHaveURL("/generate")
    const statusMsg = await page.getByTestId("generate-status")
    await expect(statusMsg).toHaveText("Ready to roll your new NFT?")

    await page.getByTestId("generate-btn").click()
    await oaoMockResponse()

    const generateSuccess = await page.getByTestId("generate-success")
    await expect(generateSuccess).toBeVisible()
})
