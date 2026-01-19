import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {   //This is just to verify structure
  constructor(page: Page) {
    super(page);
  }
}
