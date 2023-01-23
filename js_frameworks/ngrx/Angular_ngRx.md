# NgRx

The source for these notes are the [Angular University's NgRx (with NgRx Data)](https://www.udemy.com/course/ngrx-course) course. The source code is contained [here](https://github.com/angular-university/ngrx-course)

See also https://duncanhunter.gitbook.io/angular-and-ngrx/

### What is NgRx?
- NgRx provides a store for front-end state management which can be accessed and mutated via selectors, effects and reducers

### Adding NgRx To An Application Using Angular CLI
- Using the CLI command `ng add @ngRx/store`, this will add `StoreModule.forRoot(reducers, {metareducers}})` to the `AppModule`
- Using the CLI command `ng add @ngRx/store-devtools`, will add a tool for seeing the contents of the store in conjunction with Chrome plugin [Redux Devtools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)

### Adding the NgRx Store To A Module Using Angular CLI

- Using the CLI command `ng generate store auth/Auth --module auth.module.ts` (here `auth/Auth` is the path to our module and after `--module` we specify the module's typescript file). This will add ngRx as a **feature** and not as a root module:

```typescript
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        RouterModule.forChild([{path: '', component: LoginComponent}]),
        StoreModule.forFeature('auth', authReducer),
        EffectsModule.forFeature([AuthEffects])
    ],
    declarations: [LoginComponent],
    exports: [LoginComponent]
})
export class AuthModule {
    static forRoot(): ModuleWithProviders<AuthModule> {
        return {
            ngModule: AuthModule,
            providers: [AuthService, AuthGuard]
        }
    }
}
```

### A Login Component Using NgRx Store (using `dispatch` and `createAction`)

- We inject our `Store<AppState>` and we use `dispatch` which takes an instance of ngRx's `Action`

```typescript
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(
      private fb:FormBuilder,
      private auth: AuthService,
      private router:Router,
      private store: Store<AppState>) {
      this.form = fb.group({
          email: ['test@angular-university.io', [Validators.required]],
          password: ['test', [Validators.required]]
      });
  }

  ngOnInit() {}

  login() {
      const val = this.form.value;
      this.auth.login(val.email, val.password).pipe(
              tap(user => {
                  this.store.dispatch(login({user}));
                  this.router.navigateByUrl('/courses');
              })
          ).subscribe(
              noop,
              () => alert('Login Failed')
          );
  }
}
```

- In our `auth.actions.ts` we define our action. Actions have a `type` (1st arg and we follow a convention of putting the source of the action in square brackets) and `payload` (2nd arg) and usually represent a command or an event. An action represents a level of indirection:
- For the payload, we can use the `props` utility function which takes property name and type
- In the `LoginComponent` we call our `login` function to actually create the action and pass in the user (we can avoid `user: User` because Typescript allow this if the variable name and property name are the same )
- It is important to understand that an **action by itself will not change state**:

```typescript
import { createAction, props } from '@ngrx/store';
import { User } from './model/user.model';

export const login =  createAction("[Login Page] User Login", props<{user: User}>());
export const logout = createAction("[Top Menu] Logout");
```

- We can now group actions together actions so we can import all the actions together (this is just a simple Typescript trick):

```typescript
mport * as AuthActions from './auth.actions';

export {AuthActions};
```

### Changing State Using a Reducer

- The reducer describes an initial state (here `initialAuthState`) and then what should happen given a certain action :
```typescript
import { ActionReducer, ActionReducerMap, createFeatureSelector, createReducer, createSelector, MetaReducer, on } from '@ngrx/store';
import { User } from '../model/user.model';
import { AuthActions } from '../action-types';

export interface AuthState { user: User }

export const initialAuthState: AuthState = { user: undefined };
export const authReducer = createReducer(
    
    initialAuthState,
    
    on( AuthActions.login, (state, action) => {
        return {
            user: action.user
        }
    }),

    on( AuthActions.logout, (state, action) => {
        return {
            user: undefined
        }
    })
);
```
### Default Actions
- `@ngrx/store/init`  - is the initial action which gets dispatched at application start up to initialise the default values of the store
- `@ngrx/store/update-reducers` - is the action which gets dispatched whenever a feature module is loaded

### Querying the Store Using Selectors

- We can query the store using selectors. By using  `createSelector` the selector has memory so selectors are [memoized functions](https://en.wikipedia.org/wiki/Memoization) and only get re-computed if state has change
- A **feature selector** allows us to select feature state which is typesafe (i.e. state which specific to a module) and we use `createFeatureSelector<T>`
- 
```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './reducers';

export const selectAuthState = createFeatureSelector<AuthState>("auth");
export const isLoggedIn = createSelector( selectAuthState, auth =>  !!auth.user);
export const isLoggedOut = createSelector(isLoggedIn, loggedIn => !loggedIn);
```

- In our `AppComponent` we use our selectors to work out whether we are logged in:

```typescript
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    loading = true;
    isLoggedIn$: Observable<boolean>;
    isLoggedOut$: Observable<boolean>;
    constructor(private router: Router, private store: Store<AppState>) {}

    ngOnInit() {
        const userProfile = localStorage.getItem("user");
        if (userProfile) {
            this.store.dispatch(login({user: JSON.parse(userProfile)}));
        }
        this.router.events.subscribe(event => {
            switch (true) {
                case event instanceof NavigationStart: {
                    this.loading = true;
                    break;
                }
                case event instanceof NavigationEnd:
                case event instanceof NavigationCancel:
                case event instanceof NavigationError: {
                    this.loading = false;
                    break;
                }
                default: {
                    break;
                }
            }
        });
        this.isLoggedIn$ = this.store.pipe(
                select(isLoggedIn)
            );
        this.isLoggedOut$ = this.store.pipe(
                select(isLoggedOut)
            );
    }

    logout() {
        this.store.dispatch(logout());
    }
}
```

### Implementing Side-effect as Effects
