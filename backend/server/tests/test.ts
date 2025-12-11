import 'chromedriver'; 
import { Builder, By, Key, until, WebDriver, WebElement } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import { expect } from 'chai';
import 'mocha';

const TEST_TIMEOUT = 60000;

describe('SauceDemo Tests with Selenium & TypeScript', function () {
    this.timeout(TEST_TIMEOUT);

    let driver: WebDriver;

    beforeEach(async function () {
        console.log('   > Attempting to start Chrome...');

        let options = new Options();
        options.addArguments('--no-sandbox'); 
        options.addArguments('--disable-dev-shm-usage');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        
        console.log('   > Browser started. Opening website...');
        await driver.get('https://www.saucedemo.com/');

        await driver.findElement(By.id('user-name')).sendKeys('standard_user');
        await driver.findElement(By.name('password')).sendKeys('secret_sauce');
        await driver.findElement(By.css('.submit-button')).click();
    });

    afterEach(async function () {
        if (driver) {
            await driver.quit();
            console.log('   > Browser closed.\n');
        }
    });

    it('should verify page title and URL', async function () {
        await driver.wait(until.urlContains('inventory'), 10000);
        const title = await driver.getTitle();
        const currentUrl = await driver.getCurrentUrl();
        
        expect(title).to.equal('Swag Labs');
        expect(currentUrl).to.include('inventory.html');
    });

    it('should find element using XPath', async function () {
        const itemElement = await driver.wait(
            until.elementLocated(By.xpath("//div[text()='Sauce Labs Backpack']")), 
            10000
        );
        const isDisplayed = await itemElement.isDisplayed();
        expect(isDisplayed).to.be.true;
    });

    it('should add item to cart and update badge', async function () {
        const addButton = await driver.findElement(By.css('#add-to-cart-sauce-labs-backpack'));
        await addButton.click();

        const cartBadge = await driver.wait(
            until.elementLocated(By.className('shopping_cart_badge')), 
            10000
        );
        const badgeValue = await cartBadge.getText();
        expect(badgeValue).to.equal('1');
    });
});