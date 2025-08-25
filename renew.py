import os
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By

def interact(driver, selector, input=None):
    try:
        WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, selector))
        )
        elt = driver.find_element(By.CSS_SELECTOR, selector)
        elt.click()
        if input:
            elt.send_keys(input)
        return elt
    except Exception as e:
        pass

def wait_for(driver, selector):
    try:
        WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, selector))
        )
    except Exception as e:
        pass


def update_env(var: str, value: str, file_path: str = ".env"):
    try:
        with open(file_path, "r") as file:
            lines = file.readlines()

        updated = False
        with open(file_path, "w") as file:
            for line in lines:
                if line.strip().startswith(f"{var}="):
                    file.write(f"{var}={value}\n")
                    updated = True
                else:
                    file.write(line)

        if not updated:
            with open(file_path, "a") as file:
                file.write(f"{var}={value}\n")

    except FileNotFoundError:
        with open(file_path, "w") as file:
            file.write(f"{var}={value}\n")



def main(): 
    load_dotenv()
    login = os.getenv("INTRA_LOGIN")
    password = os.getenv("INTRA_PASSWORD")
    options = Options()
    options.add_argument("--headless")
    driver = webdriver.Firefox(options=options)
    driver.get("https://profile.intra.42.fr/oauth/applications/69133")
    interact(driver, "#username", login)
    interact(driver, "#password", password)
    interact(driver, "#kc-login")
    wait_for(driver, 'body > div.page > div.page-content.page-content-fluid > div > div.application-item--detail.container-item > div > div.col-sm-10 > div.application-details > div.client-credentials > div:nth-child(2) > div:nth-child(1) > pre > div > div.credential')
    secret = driver.find_element(By.CSS_SELECTOR, "body > div.page > div.page-content.page-content-fluid > div > div.application-item--detail.container-item > div > div.col-sm-10 > div.application-details > div.client-credentials > div:nth-child(2) > div:nth-child(1) > pre > div > div.credential")
    update_env("NEXT_PUBLIC_FORTY_TWO_CLIENT_SECRET", secret.text)
    driver.close()


if __name__ == "__main__":
    main()