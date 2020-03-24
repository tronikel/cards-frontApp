import { TestBed } from '@angular/core/testing';

import { MyTokenService } from './my-token.service';

describe('MyTokenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyTokenService = TestBed.get(MyTokenService);
    expect(service).toBeTruthy();
  });
});
