<link rel="stylesheet" href="/assets/css/styles.css">
<script src="/assets/js/accordion.js"></script>

# Angular Notes


### Course Sections

1. [Getting Started](#section-1)
2. [Angular Essentials - Components, Templates, Services & More](#section-2)
3. [Angular Essentials - Working with Modules (The "Legacy" Way)](#section-3)
4. [Angular Essentials - Time to Practice](#section-4)
5. [Debugging Angular Apps](#section-5)
6. [Components & Templates - Deep Dive](#section-6)
7. [Directives - Deep Dive](#section-7)
8. [Transforming Values with Pipes - Deep Dive](#section-8)
9. [Understanding Services & Dependency Injection - Deep Dive](#section-9)
10. [Making Sense of Change Detection - Deep Dive](#section-10)
11. [Working with RxJS (Observables) - Deep Dive](#section-11)
12. [Sending HTTP Requests & Handling Responses](#section-12)
13. [Handling User Input & Working with Forms](#section-13)
14. [Routing & Building Multi-page Single Page Applications](#section-14)
15. [Code Splitting & Deferrable Views](#section-15)
16. [Authentication](#section-16)





## <a id="section-1"></a>Getting Started & The Component Basics

### 1. What is Angular?

* **Definition:** A JavaScript framework which allows you to create reactive **Single Page Applications (SPAs)**.
* **Single Page Application:** Only one HTML file is delivered to the browser by the server. Everything else is managed by JavaScript (Angular) which changes what the user sees without requesting new pages from the server.
* **Key Advantage:** Provides a "mobile app-like" user experience where transitions are instant.

### 2. Project Structure (The Essentials)

When you create a new project (via `ng new`), the core files are:

* **`main.ts`**: The entry point of the application. It bootstraps (starts) the Angular application.
* **`index.html`**: The single HTML file served to the browser. It contains a custom tag (like `<app-root>`) where the app is rendered.
* **`app.component.ts`**: The "Root Component." Every Angular app has at least one component that holds the rest of the application.

---

### 3. Creating a First Custom Component

Angular applications are built as a **tree of components**. To create a component manually, you follow these requirements from the course:

#### A. The Class

You define a normal TypeScript class to store data and logic.

```typescript
export class HeaderComponent {
  // Logic goes here
}

```

#### B. The @Component Decorator

You must "decorate" the class to tell Angular it’s not just a class, but a component. This requires an import from `@angular/core`.

* **`selector`**: The custom HTML tag name you will use (e.g., `'app-header'`).
* **`standalone: true`**: (Modern Angular) Tells Angular this component doesn't need an `NgModule`.
* **`templateUrl`**: Points to the HTML file for this component.
* **`styleUrls`**: Points to the CSS file(s) for this component.

**Example Syntax:**

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {}

```

#### C. Using the Component

To use your new component in another component (like `app.component.ts`), you must:

1. **Import** the class at the top of the file.
2. **Add** it to the `imports: []` array of the receiving component's decorator.
3. **Use** the selector in the HTML (e.g., `<app-header />`).

---

### 4. Working with the Angular CLI

The course emphasizes using the **Command Line Interface** to automate creation:

* **Command:** `ng generate component component-name` (or `ng g c name`).
* **Benefit:** Automatically creates the `.ts`, `.html`, `.css`, and `.spec.ts` files and handles basic configuration.

---


## Outputting Dynamic Content & Binding

### 1. String Interpolation

* **Purpose:** A way to output data (text) in your HTML template.
* **Syntax:** Uses double curly braces: `{{ expression }}`.
* **How it works:** Angular evaluates the code between the braces and converts the result into a string.
* **Rules:** * You can reference properties of the component class.
* You can call methods that return a value.
* You cannot use complex logic like `if` or `for` loops inside the braces.



**Example:**

```typescript
// component.ts
export class UserComponent {
  selectedUser = { name: 'Jasmine' };
}

```

```html
<p>Hello, {{ selectedUser.name }}</p>

```

---

### 2. Property Binding

* **Purpose:** Used to set a value for an element property (like `src`, `href`, or `disabled`) or a component's input property.
* **Syntax:** Wrap the property name in square brackets: `[property]="value"`.
* **How it works:** Binds the property to a dynamic value from the component class.

**Example:**

```html
<img [src]="userImagePath" [alt]="userName" />

```

*Note: Using `src="{{ userImagePath }}"` also works, but `[src]` is the preferred "Property Binding" syntax taught in the course.*

---

### 3. Binding to Event Listeners (Event Binding)

* **Purpose:** Used to listen for user interactions (clicks, keyup, mouseover, etc.) and trigger code in the TypeScript class.
* **Syntax:** Wrap the event name in parentheses: `(event)="methodName()"`.
* **How it works:** When the event occurs, the specified method in the component class is executed.

**Example:**

```html
<button (click)="onSelectUser()">Click Me</button>

```

---

### 4. Working with Assets

The course explains how to manage static files (images, icons):

* **The `public` folder:** (Modern Angular) Files placed in the `public` folder are served at the root level.
* **Referencing Images:** In your component logic, you can define paths to these images to use them in Property Binding.

---

### 5. Concept: State & Reactivity (Intro)

The course introduces the idea that Angular needs to know when something changes to update the UI:

* **Initial Concept:** When a class property (like `selectedUser`) is updated via a click event, Angular detects that change and automatically updates the parts of the DOM that use that property.
* **Modern Note:** This is the foundation for later deep dives into **Signals** and **Change Detection**.


---

## <a id="section-2"></a>Section 2: Angular Essentials - Components, Templates, Services & More

### 1. Module Introduction

* **Goal:** The goal of this section is to introduce the core building blocks of Angular: Components, Templates, Directives, Services, and Dependency Injection.
* **Approach:** We will build an "Easy Task" application (a task management app) from scratch to learn these concepts.

### 2. A New Starting Project & Analyzing The Project Structure

* **`index.html`:** The only HTML file served by the server. It contains the `<app-root>` element.
* **`main.ts`:** The entry point. It creates the Angular application and renders the Root Component (`AppComponent`) into the `<app-root>` element.
* **`styles.css`:** Global styles applied to the entire application.
* **`angular.json`:** Configuration file for the CLI (build settings, file paths).

### 3. Understanding Components & How Content Ends Up On The Screen

* **Component Tree:** An Angular app is a tree of nested components.
* **Root Component:** The `AppComponent` is the top-most component. All other components are nested inside it.
* **HTML vs. Component:** Angular takes the component's HTML template and renders it wherever the component's selector tag (e.g., `<app-root>`) is found.

### 4. Creating a First Custom Component

* **Manual Creation:** The course starts by creating a `header` component manually to understand the wiring.
* **File Naming:** Standard convention is `name.component.ts`.
* **Class Definition:** A component is just a standard JavaScript/TypeScript class.
```typescript
export class HeaderComponent {}

```



### 5. [Optional] JavaScript Refresher: Classes, Properties & More

* **Classes:** Blueprints for objects.
* **Properties:** Variables attached to a class (e.g., `name = 'Max'`).
* **Methods:** Functions attached to a class (e.g., `greet() { ... }`).

### 6. Configuring the Custom Component

* **The `@Component` Decorator:** To turn a class into a component, you must add the `@Component` decorator (imported from `@angular/core`).
* **Configuration Object:**
* `selector`: The HTML tag to use (e.g., `'app-header'`).
* `standalone`: Set to `true` (for modern Angular).
* `templateUrl`: Path to the HTML file (`'./header.component.html'`).
* `styleUrls`: Array of paths to CSS files (`['./header.component.css']`).
* *(Note: You can also use `template` and `styles` for inline code, but separate files are recommended).*



### 7. Using the Custom Component

* **Step 1: Import:** In `app.component.ts`, import the `HeaderComponent` class.
* **Step 2: Register:** Add `HeaderComponent` to the `imports: []` array inside the `AppComponent` decorator.
* **Step 3: Use:** Add the selector `<app-header></app-header>` inside `app.component.html`.

### 8. Styling the Header Component & Adding An Image

* **Scoped Styles:** Styles defined in `header.component.css` only apply to the Header component. They do not leak to other components.
* **Global Styles:** Styles in `src/styles.css` apply everywhere.
* **Images:**
* Images are placed in the `public` folder (in modern Angular projects).
* Referenced in HTML relative to the root: `<img src="logo.png" />`.



### 9. Managing & Creating Components with the Angular CLI

* **Command:** `ng generate component user` (or `ng g c user`).
* **What it does:**
1. Creates a folder (`src/app/user`).
2. Generates 4 files: `.ts` (logic), `.html` (template), `.css` (styles), `.spec.ts` (testing).
3. Automatically adds the boilerplate code (`@Component` decorator).



### 10. Styling & Using Our Next Custom Component

* The course adds a "User" component to display a list of users.
* We add basic CSS for a card-like look.
* We register `UserComponent` in the `imports` array of `AppComponent` and use `<app-user />` in the HTML.

### 11. Preparing User Data (To Output Dynamic Content)

* **Dummy Data:** A separate file `dummy-users.ts` is created exporting an array of user objects.
```typescript
export const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Jasmine Washington',
    avatar: 'user-1.jpg',
  },
  // ... more users
];

```


* **Math.random():** Logic is added to `user.component.ts` to pick a random user from this array to simulate dynamic data.

### 12. Storing Data in a Component Class

* Properties defined in the class are accessible to the template.
```typescript
import { DUMMY_USERS } from './dummy-users';

const randomIndex = Math.floor(Math.random() * DUMMY_USERS.length);

export class UserComponent {
  selectedUser = DUMMY_USERS[randomIndex];
}

```



### 13. Outputting Dynamic Content with String Interpolation

* **Syntax:** `{{ }}`
* **Usage:** Used to output text content in the HTML.
```html
<span>{{ selectedUser.name }}</span>

```


* **Constraint:** You cannot write block statements (like `if` or `for`) inside the curly braces, only expressions that produce a value.

### 14. Property Binding & Outputting Computed Values

* **Problem:** We need to bind the `src` attribute of an `<img>` tag to a dynamic path.
* **Syntax:** `[property]="value"`
* **Usage:**
```html
<img [src]="'users/' + selectedUser.avatar" [alt]="selectedUser.name" />

```


* **Difference:** String interpolation `{{ }}` is for text content. Property binding `[]` is for element attributes/properties.

### 15. Attribute Binding

* *Note from course:* Usually, we bind to DOM properties (like `src`, `disabled`, `value`).
* Occasionally, you need to bind to HTML attributes (like `aria-label`). The syntax is virtually the same in modern Angular, but conceptually distinct.

### 16. Using Getters For Computed Values

* **Concept:** Instead of writing complex logic inside the HTML template (like `'users/' + selectedUser.avatar`), use a **getter** in the class.
* **Syntax:**
```typescript
get imagePath() {
  return 'assets/users/' + this.selectedUser.avatar;
}

```


* **Template Usage:**
```html
<img [src]="imagePath" />

```


*(Angular treats the getter like a property).*

### 17. Listening to Events with Event Binding

* **Syntax:** `(event)="methodName()"`
* **Example:** Listening to a button click.
```html
<button (click)="onSelectUser()">User Name</button>

```


* **Handler:**
```typescript
export class UserComponent {
  onSelectUser() {
    console.log('Clicked!');
  }
}

```



### 18. Managing State & Changing Data

* **Goal:** Update the UI when the user clicks the button.
* **Implementation:** We update the `selectedUser` property inside the `onSelectUser()` method.
```typescript
onSelectUser() {
    const randomIndex = Math.floor(Math.random() * DUMMY_USERS.length);
    this.selectedUser = DUMMY_USERS[randomIndex];
}

```


* **Result:** When `this.selectedUser` changes, the UI updates automatically.

### 19. A Look Behind The Scenes Of Angular's Change Detection Mechanism

* **Zone.js:** Angular uses a library called `zone.js`.
* **How it works:** It creates a "zone" around your application code. It listens to all asynchronous events (clicks, timers, HTTP requests).
* **Trigger:** When such an event occurs (like our `click` event), Zone.js tells Angular "Something happened!".
* **Check:** Angular then checks **all** components to see if any data changed and updates the view if necessary.

---


### 20. Introducing Signals

* **Definition:** A Signal is a wrapper around a value that can notify interested consumers when that value changes.
* **Why Signals?**
* In Zone.js (standard) change detection, Angular checks *everything* when an event happens.
* With Signals, Angular knows *exactly* where data changed and can update *only* that specific part of the DOM. This is more performant (fine-grained reactivity).


* **Creating a Signal:**
```typescript
import { signal } from '@angular/core';

export class UserComponent {
  // Create a signal with an initial value
  selectedUser = signal(DUMMY_USERS[0]); 

  onSelectUser() {
    // Update the signal
    const randomIndex = Math.floor(Math.random() * DUMMY_USERS.length);
    this.selectedUser.set(DUMMY_USERS[randomIndex]);
  }
}

```


* **Reading a Signal:** In the template (or code), you must call the signal as a function: `selectedUser()`.
```html
<p>{{ selectedUser().name }}</p>

```


* **Computed Signals:** Values that depend on other signals. They update automatically when the dependency changes.
```typescript
import { computed } from '@angular/core';
// ...
imagePath = computed(() => 'assets/users/' + this.selectedUser().avatar);

```



### 21. We Need More Flexible Components!

* **Problem:** Currently, the `UserComponent` selects its own random user.
* **Goal:** We want to pass the user data *into* the component from the parent (`AppComponent`), making the `UserComponent` reusable for *any* user.

### 22. Defining Component Inputs (Standard Approach)

* **Decorator:** Use the `@Input` decorator to mark a property as settable from the outside.
* **Configuration:**
```typescript
import { Input } from '@angular/core';

export class UserComponent {
  @Input() avatar!: string; // '!' tells TS this will be set eventually
  @Input() name!: string;
}

```


* **Usage in Parent:**
```html
<app-user [avatar]="users[0].avatar" [name]="users[0].name" />

```



### 23. Required & Optional Inputs

* **Optional:** By default, inputs are optional.
* **Required:** You can force a parent component to provide a value.
```typescript
@Input({ required: true }) avatar!: string;

```


*If the parent fails to provide `[avatar]`, Angular throws an error during compilation.*

### 24. Using Signal Inputs (Modern Approach)

* **Function:** Angular 17.1+ introduced the `input()` function as an alternative to the `@Input` decorator.
* **Benefit:** It creates a Signal, meaning you get reactivity for free.
* **Syntax:**
```typescript
import { input } from '@angular/core';

export class UserComponent {
  // Inputs are read-only signals
  avatar = input.required<string>(); 
  name = input.required<string>(); 

  // Computing based on input is easy
  imagePath = computed(() => 'assets/users/' + this.avatar());
}

```



### 25. We Need Custom Events! (Outputs)

* **Problem:** When a user clicks a user card, the *Parent* component needs to know *which* ID was clicked to show tasks for that user.
* **Direction:** Data needs to flow **up** (Child → Parent).

### 26. Working with Outputs & Emitting Data (Standard Approach)

* **Decorator:** Use `@Output`.
* **Mechanism:** Use `EventEmitter` to create a custom event.
* **Steps:**
1. **Define:**
```typescript
@Output() select = new EventEmitter<string>(); // Emits a string (id)

```


2. **Emit:**
```typescript
onSelectUser() {
  this.select.emit(this.id);
}

```


3. **Listen (Parent):**
```html
<app-user (select)="onSelectUser($event)" />

```


*`$event` contains the data emitted (the ID).*



### 27. Using the output() Function (Modern Approach)

* **Function:** Angular now provides an `output()` function.
* **Syntax:**
```typescript
import { output } from '@angular/core';

export class UserComponent {
  select = output<string>(); // No 'new EventEmitter' needed

  onSelectUser() {
    this.select.emit(this.id);
  }
}

```


* *Note: The usage in the parent HTML template remains exactly the same `(select)="..."`.*

### 28. TypeScript: Working With Potentially Undefined Values & Union Types

* **Scenario:** Sometimes a property might be a string OR undefined.
* **Union Type:**
```typescript
selectedUserId?: string; // string | undefined

```


* **Handling:** You must check if the value exists before using it, or use optional chaining (`?.`).

### 29. Accepting Objects As Inputs & Adding Appropriate Typings

* Instead of passing `name`, `id`, `avatar` separately, pass a single `user` object.
* **Type Definition:** Define the shape of the user object using an Interface or Type Alias to ensure type safety.

### 30. TypeScript: Type Aliases & Interfaces

* **Interface:**
```typescript
export interface User {
  id: string;
  name: string;
  avatar: string;
}

```


* **Usage in Component:**
```typescript
@Input({ required: true }) user!: User;

```


* **Type Alias:** (Alternative)
```typescript
export type User = {
  id: string;
  name: string;
  avatar: string;
};

```


* *Course Note: Both are fine, Interfaces are often preferred for objects.*

### 31. Outputting List Content (@for)

* **Problem:** We have an array of users (`DUMMY_USERS`) and want to render an `<app-user>` for each one.
* **Modern Syntax:** Angular 17+ introduced the built-in control flow block `@for`.
* **Track:** You **must** provide a `track` expression. Angular uses this to identify items (like a "key"). usually a unique ID.
```html
<ul>
  @for (user of users; track user.id) {
    <li>
      <app-user [user]="user" (select)="onSelectUser($event)" />
    </li>
  }
</ul>

```



### 32. Outputting Conditional Content (@if)

* **Problem:** We only want to show the task list if a user has actually been selected.
* **Modern Syntax:**
```html
@if (selectedUser) {
  <app-tasks [name]="selectedUser.name" />
} @else {
  <p>Select a user to see their tasks!</p>
}

```



### 33. Legacy Angular: Using ngFor & ngIf

* The course briefly covers the older "Structural Directives" for older codebases.
* `*ngFor="let user of users"` (Needs `CommonModule` or imports).
* `*ngIf="selectedUser"`.



### 34. Outputting User-specific Tasks

* Logic is added to `app.component.ts`:
* `selectedUserId` property tracks the active user.
* A getter `selectedUser` finds the full user object from the array using the ID.
* A generic `tasks` array (in `dummy-tasks.ts`) contains tasks linked to user IDs.
* A getter `selectedUserTasks` filters the tasks array to return only tasks where `task.userId === selectedUserId`.



### 35. Storing Data Models in Separate Files

* **Best Practice:** Don't clutter component files with interface definitions.
* **Action:** Create `user.model.ts` and `task.model.ts` and export the interfaces there. Import them wherever needed.

### 36. Dynamic CSS Styling with Class Bindings

* **Goal:** Highlight the selected user in the list (add a `.active` CSS class).
* **Syntax:** `[class.className]="condition"`
* **Usage:**
```html
<button [class.active]="selected" (click)="onSelectUser()">

```


* **Logic:** If the `selected` property is `true`, Angular adds the class `active`. If `false`, it removes it.

---

### 37. More Component Communication: Deleting Tasks

* **Scenario:** The `TaskComponent` displays a single task. It has a "Complete" button. When clicked, this task should be removed from the list.
* **Challenge:** The *list* of tasks lives in the parent (`TasksComponent` or `AppComponent`). The child cannot delete itself directly.
* **Solution (Output Event):**
1. **Child:** `TaskComponent` defines an output `@Output() complete = new EventEmitter<string>();`
2. **Trigger:** When the button is clicked, emit the task ID: `this.complete.emit(this.task.id)`.
3. **Parent:** The parent listens to the event `(complete)="onCompleteTask($event)"` and filters the array to remove that ID.



### 38. Creating & Conditionally Rendering Another Component

* **Goal:** Create a `NewTaskComponent` that appears when the "Add Task" button is clicked.
* **State Management:**
* The parent (`TasksComponent`) holds a boolean property `isAddingTask = false`.
* When "Add Task" is clicked, `isAddingTask` becomes `true`.


* **Conditional UI:**
```html
@if (isAddingTask) {
  <app-new-task (cancel)="onCancelAddTask()" />
}

```


* **Backdrop:** A div is usually added behind the dialog to darken the background. Clicking it triggers the "Cancel" logic.

### 39. Using Directives & Two-Way-Binding

* **Goal:** We need to capture the Title, Summary, and Date entered by the user in the `NewTaskComponent`.
* **Module Requirement:** To use Two-Way Binding, you **must** import `FormsModule` from `@angular/forms` into the component's imports array.
* **Syntax:** `[(ngModel)]="propertyName"` (The "Banana in a Box" syntax).
* **How it works:**
* **Data Flow Down:** The value of `propertyName` is displayed in the input.
* **Data Flow Up:** When the user types, `propertyName` is automatically updated in the class.


```html
<input type="text" [(ngModel)]="enteredTitle" />

```



### 40. Signals & Two-Way-Binding

* **Note:** `[(ngModel)]` works with Signals too.
* **Syntax:** It looks exactly the same in the template: `[(ngModel)]="enteredTitle"`.
* **Difference:** In the class, `enteredTitle` is a signal (`enteredTitle = signal('')`). Angular automatically handles reading and setting the signal value.

### 41. Handling Form Submission

* **Event:** Use the `(ngSubmit)` event on the `<form>` element, not `(click)` on the button.
* **Why:** This ensures standard form behavior (like submitting on "Enter" key) works.
```html
<form (ngSubmit)="onSubmit()">
  <button type="submit">Create</button>
</form>

```



### 42. Content Projection with ng-content

* **Problem:** We created a `CardComponent` to style boxes (shadows, rounded corners). But currently, components can't just wrap other HTML content like `<app-card> <p>Content</p> </app-card>`.
* **Solution:** Angular's **Content Projection**.
* **Implementation:**
1. **In Card Component Template:** Add the `<ng-content />` tag. This marks the "slot" where external content will be dropped.
2. **Usage:**
```html
<app-card>
  <form>...</form>
</app-card>

```




* **Result:** The `<form>` is rendered inside the `<app-card>` structure where `<ng-content>` was placed.

### 43. Transforming Template Data with Pipes

* **Definition:** Pipes are simple functions that accept an input value and return a transformed value for display in the template.
* **Syntax:** Use the pipe operator `|`.
* **Example (Date Pipe):** Formatting a raw date string into a readable format.
```html
<p>{{ task.dueDate | date:'fullDate' }}</p>

```


* **Built-in Pipes:** Angular comes with many, such as `date`, `uppercase`, `currency`, etc.

---

### 44. Getting Started with Services

* **Definition:** A Service is a class responsible for a specific task (business logic), typically related to data management (fetching, storing, updating data).
* **Why Services?**
* Separation of Concerns: Components should only care about *displaying* data (UI).
* Reusability: Logic can be shared across multiple components without duplicating code.



### 45. Getting Started with Dependency Injection (DI)

* **Problem:** If we create a `TasksService`, how does a component get access to it? We *could* create a new instance manually (`new TasksService()`), but this is bad practice (tight coupling).
* **Solution:** **Dependency Injection**. We ask Angular to give us an instance.
* **Step 1: The Decorator:** Add `@Injectable({ providedIn: 'root' })` to the Service class. This tells Angular it can inject this class anywhere in the app.
```typescript
@Injectable({ providedIn: 'root' })
export class TasksService { ... }

```


* **Step 2: Injection (Constructor Method):**
```typescript
export class TasksComponent {
  constructor(private tasksService: TasksService) {}
}

```



### 46. Alternative Dependency Injection Mechanism (inject function)

* **Modern Approach:** Angular 14+ introduced the `inject()` function.
* **Usage:** You can use it as a property assignment instead of the constructor.
```typescript
import { inject } from '@angular/core';

export class TasksComponent {
  private tasksService = inject(TasksService);
}

```



### 47. Managing Data in the Service

* The `TasksService` now becomes the "Single Source of Truth."
* **Methods:**
* `getUserTasks(userId)`: Returns filtered tasks.
* `addTask(taskData, userId)`: Pushes a new task to the array.
* `removeTask(id)`: Filters the array to remove the task.


* The Components (`TasksComponent`, `NewTaskComponent`) now just call these methods. They no longer manipulate the array directly.

### 48. Using localStorage for Data Storage

* **Goal:** Data is lost when the browser refreshes. We want to persist it.
* **Browser API:** `localStorage`.
* **Implementation in Service:**
1. Create a helper method `saveTasks()` that calls `localStorage.setItem('tasks', JSON.stringify(this.tasks))`.
2. Call `saveTasks()` whenever we add or remove a task.
3. **Initialize:** In the Service `constructor`, check `localStorage.getItem('tasks')` to load saved data when the app starts.



---


## <a id="section-3"></a>Section 3: Angular Essentials - Working with Modules

### 1. What are Modules?

* **Definition:** An `NgModule` is a container for a cohesive block of code dedicated to an application domain, a workflow, or a closely related set of capabilities.
* **Analogy:** If a Component is a "brick," a Module is a "box" that bundles those bricks together so they can be shipped and used.
* **The "Standalone" Difference:**
* **Standalone:** Components manage their own dependencies via their own `imports` array.
* **Modules:** The Module manages the dependencies for *all* components declared inside it. The components themselves are lightweight and don't declare imports.



### 2. The Root Module (AppModule)

* Every module-based Angular app has at least one module: the **Root Module**, conventionally named `AppModule`.
* **Location:** `src/app/app.module.ts`.
* **Decorator:** It uses the `@NgModule` decorator from `@angular/core`.

### 3. Converting a Standalone Component to a Module-based Component

To make a component work with Modules, you must change its configuration:

1. **Remove** `standalone: true` from the `@Component` decorator.
2. **Remove** the `imports: [...]` array from the `@Component` decorator.
* *Why?* Because imports will now be handled by the Module, not the component.



**Example (Module-based Component):**

```typescript
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
  // No 'standalone: true'
  // No 'imports'
})
export class HeaderComponent {}

```

### 4. Anatomy of an NgModule

The `@NgModule` decorator takes a metadata object with four key arrays:

#### A. declarations

* **Purpose:** Introduces components, directives, and pipes to the Module.
* **Rule:** A component must be declared in **exactly one** NgModule.
* **Example:**
```typescript
declarations: [AppComponent, HeaderComponent, UserComponent]

```



#### B. imports

* **Purpose:** Imports *other* NgModules that this module needs.
* **Standard Imports:**
* `BrowserModule`: Required in `AppModule` to run the app in a browser.
* `FormsModule`: Required to use `[(ngModel)]`.
* `SharedModule`: Any custom modules you create.


* **Example:**
```typescript
imports: [BrowserModule, FormsModule]

```



#### C. exports

* **Purpose:** Defines which components (or pipes/directives) from *this* module should be accessible to *other* modules that import this one.
* **Concept:** If you don't export a component, it is "private" to this module and cannot be used in other modules' templates.

#### D. bootstrap

* **Purpose:** Identifies the Root Component that Angular should bootstrap (start) when the application launches.
* **Usage:** Only used in the Root Module (`AppModule`).
* **Example:** `bootstrap: [AppComponent]`

### 5. Creating a Shared Module

* **Scenario:** You have a generic UI component (like the `CardComponent`) that is used by multiple features (e.g., used by both the User list and the Task list).
* **Solution:** Create a `SharedModule`.
* **Implementation:**
1. Create `shared.module.ts`.
2. `declare` the `CardComponent`.
3. `export` the `CardComponent` (so others can use it).
4. Import `SharedModule` into `AppModule` (or wherever needed).



### 6. Main.ts Refactoring

* When using Modules, the entry point (`main.ts`) changes.
* **Standalone Bootstrap:**
`bootstrapApplication(AppComponent, ...)`
* **Module Bootstrap:**
`platformBrowserDynamic().bootstrapModule(AppModule)`

### 7. Resolving Dependencies (The "Zone" of the Module)

* If `TaskComponent` uses the built-in `DatePipe` or `*ngIf`:
* In **Standalone**: You import `CommonModule` (or `DatePipe`) directly in the component.
* In **Modules**: You import `CommonModule` into the `AppModule` (or `TasksModule`). Now *all* components declared in that module automatically get access to `*ngIf`, `*ngFor`, etc.



### 8. Services in Modules

* **Since Angular 6+:** The preferred way to provide services is `providedIn: 'root'` in the service itself. This works for both Standalone and Modules.
* **Legacy Way:** You can also add services to the `providers: []` array in the `@NgModule`.

---


## <a id="section-4"></a>Section 4: Angular Essentials - Time to Practice

### 1. Module Introduction

* **Goal:** The goal of this section is to practice all the core concepts learned so far: Components, Data Binding, Structural Directives (`@for`, `@if`), and Two-Way Binding.
* **The App:** We will build an "Investment Calculator" that takes user inputs (Initial Investment, Annual Investment, Expected Return, Duration) and displays a table showing how the investment grows over time.

### 2. Problem Statement & Challenge

* **Starting State:** You are provided with a starting project containing:
* Basic CSS files.
* An `assets` folder with an image (`investment-calculator-logo.png`).
* An empty `app.component.ts`.


* **Requirements:**
1. Create a Header component.
2. Create a User Input component to collect 4 values.
3. Create a Results component to display a table of yearly data.
4. Calculate the investment results based on the inputs.
5. Pass data between these components.



### 3. Creating the Header Component

* **Task:** Create a simple presentational component for the logo and title.
* **Code (Component Class):**
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {}

```


* **Code (Template):**
```html
<header>
  <img src="assets/investment-calculator-logo.png" alt="Green graph" />
  <h1>Investment Calculator</h1>
</header>

```



### 4. Creating the User Input Component

* **Task:** Create the form area where users type their numbers.
* **Code (Component Class):**
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-input',
  standalone: true,
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.css']
})
export class UserInputComponent {}

```


* **Code (App Component Integration):**
* Import `HeaderComponent` and `UserInputComponent` in `app.component.ts`.
* Add `<app-header />` and `<app-user-input />` to `app.component.html`.



### 5. Managing User Input State (Two-Way Binding)

* **Task:** Bind the input fields to properties in the class so we can access the values.
* **Requirement:** Import `FormsModule` to use `[(ngModel)]`.
* **Code (Component Class):**
```typescript
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-input',
  standalone: true,
  imports: [FormsModule], // Required for ngModel
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.css']
})
export class UserInputComponent {
  // Using Signals for state
  enteredInitialInvestment = signal('0');
  enteredAnnualInvestment = signal('0');
  enteredExpectedReturn = signal('5');
  enteredDuration = signal('10');
}

```


* **Code (Template):**
```html
<section id="user-input">
  <div class="input-group">
    <p>
      <label>Initial Investment</label>
      <input type="number" [(ngModel)]="enteredInitialInvestment" />
    </p>
    <p>
      <label>Annual Investment</label>
      <input type="number" [(ngModel)]="enteredAnnualInvestment" />
    </p>
    </div>
</section>

```



### 6. Submitting the Form

* **Task:** React when the user clicks "Calculate".
* **Code (Template):**
```html
<form (ngSubmit)="onSubmit()">
   <button type="submit">Calculate</button>
</form>

```


* **Code (Class Logic):**
```typescript
onSubmit() {
  // Logic to handle submission will go here
  console.log('Submitted!');
  console.log(this.enteredInitialInvestment());
}

```



### 7. Defining a Data Model for the Investment Input

* **Task:** Define an interface so we don't pass 4 loose arguments around. We want type safety.
* **Code (`investment-input.model.ts`):**
```typescript
export interface InvestmentInput {
  initialInvestment: number;
  duration: number;
  expectedReturn: number;
  annualInvestment: number;
}

```



### 8. Outputting Data to the Parent Component (Option 1: Component Output)

* **Task:** The `UserInputComponent` has the data, but the `AppComponent` needs it to calculate results. We need to emit an event.
* **Code (UserInputComponent):**
```typescript
import { Component, output, signal } from '@angular/core';
import { InvestmentInput } from './investment-input.model';

export class UserInputComponent {
  // Create an output event
  calculate = output<InvestmentInput>();

  // Signals for inputs...

  onSubmit() {
    // Emit the object converting strings to numbers
    this.calculate.emit({
      initialInvestment: +this.enteredInitialInvestment(),
      duration: +this.enteredDuration(),
      expectedReturn: +this.enteredExpectedReturn(),
      annualInvestment: +this.enteredAnnualInvestment()
    });
  }
}

```



---


### 9. Receiving Data in the App Component

* **Task:** Listen to the `(calculate)` event emitted by `<app-user-input>` and store the data to run the calculation.
* **Code (AppComponent Template):**
```html
<app-user-input (calculate)="onCalculateInvestmentResults($event)" />

```


* **Code (AppComponent Logic):**
```typescript
import { Component } from '@angular/core';
import { InvestmentInput } from './investment-input.model';

@Component({ ... })
export class AppComponent {
  onCalculateInvestmentResults(data: InvestmentInput) {
    // Calculation logic will go here
    console.log(data);
  }
}

```



### 10. The Calculation Logic (Provided Code)

* **Task:** Implement the financial math. The course provides a specific algorithm to determine yearly growth.
* **Code (AppComponent):**
```typescript
resultsData?: {
  year: number;
  interest: number;
  valueEndOfYear: number;
  annualInvestment: number;
  totalInterest: number;
  totalAmountInvested: number;
}[];

onCalculateInvestmentResults(data: InvestmentInput) {
  const { initialInvestment, annualInvestment, expectedReturn, duration } = data;
  const annualData = [];
  let investmentValue = initialInvestment;

  for (let i = 0; i < duration; i++) {
    const year = i + 1;
    const interestEarnedInYear = investmentValue * (expectedReturn / 100);
    investmentValue += interestEarnedInYear + annualInvestment;
    const totalInterest =
      investmentValue - annualInvestment * year - initialInvestment;

    annualData.push({
      year: year,
      interest: interestEarnedInYear,
      valueEndOfYear: investmentValue,
      annualInvestment: annualInvestment,
      totalInterest: totalInterest,
      totalAmountInvested: initialInvestment + annualInvestment * year,
    });
  }

  this.resultsData = annualData;
}

```



### 11. Creating the Investment Results Component

* **Task:** Create a component to render the table of results.
* **Code (Results Component):**
```typescript
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-investment-results',
  standalone: true,
  templateUrl: './investment-results.component.html',
  styleUrls: ['./investment-results.component.css']
})
export class InvestmentResultsComponent {
  // Receive the results array from the parent
  // Note: We use 'results' alias for cleaner template code if desired, 
  // but here we stick to the property name.
  results = input<{
    year: number;
    interest: number;
    valueEndOfYear: number;
    annualInvestment: number;
    totalInterest: number;
    totalAmountInvested: number;
  }[]>(); 
}

```



### 12. Displaying the Results with Control Flow (@for & @if)

* **Task:** Render a table row `<tr>` for every year in the results array. Also, show a fallback message if no results exist yet.
* **Code (Template):**
```html
@if (!results()) {
  <p class="center">Please enter some values and press "Calculate".</p>
} @else {
  <table>
    <thead>
      <tr>
        <th>Year</th>
        <th>Investment Value</th>
        <th>Interest (Year)</th>
        <th>Total Interest</th>
        <th>Invested Capital</th>
      </tr>
    </thead>
    <tbody>
      @for (result of results(); track result.year) {
        <tr>
          <td>{{ result.year }}</td>
          <td>{{ result.valueEndOfYear }}</td>
          <td>{{ result.interest }}</td>
          <td>{{ result.totalInterest }}</td>
          <td>{{ result.totalAmountInvested }}</td>
        </tr>
      }
    </tbody>
  </table>
}

```



### 13. Formatting with Pipes (Currency Pipe)

* **Task:** The numbers currently look like plain integers/floats. We want them formatted as currency (e.g., `$1,200.00`).
* **Implementation:** Use the built-in `currency` pipe.
* **Requirements:** In a Standalone Component, you must import `CurrencyPipe` (or `CommonModule`).
* **Code (Template):**
```html
<td>{{ result.valueEndOfYear | currency }}</td>
<td>{{ result.interest | currency }}</td>

```



### 14. Refactoring: Using a Service

* **Motivation:** Currently, `AppComponent` handles the logic, but it should really just be coordinating components. The calculation logic is "business logic" and belongs in a Service.
* **Task:** Move calculation logic to `InvestmentService`.

**Step A: Create the Service**
`ng g s investment`

```typescript
import { Injectable, signal } from '@angular/core';
import { InvestmentInput } from './investment-input.model';

@Injectable({ providedIn: 'root' })
export class InvestmentService {
  // Store results as a signal so components can react
  resultData = signal<{...}[] | undefined>(undefined);

  calculateInvestmentResults(data: InvestmentInput) {
    // ... paste the calculation logic here ...
    // Update the signal at the end
    this.resultData.set(annualData);
  }
}

```

**Step B: Update UserInputComponent (Send Data to Service)**
Instead of emitting an event to the parent, we call the service directly.

```typescript
import { inject } from '@angular/core';
import { InvestmentService } from './investment.service';

export class UserInputComponent {
  private investmentService = inject(InvestmentService);

  onSubmit() {
    this.investmentService.calculateInvestmentResults({
      initialInvestment: +this.enteredInitialInvestment(),
      // ...
    });
  }
}

```

**Step C: Update ResultsComponent (Read Data from Service)**
Instead of receiving data via `@Input`, we read the signal from the service.

```typescript
import { inject, computed } from '@angular/core';
import { InvestmentService } from './investment.service';

export class InvestmentResultsComponent {
  private investmentService = inject(InvestmentService);
  
  // Create a computed property to expose the service's signal
  results = computed(() => this.investmentService.resultData());
  // Or simply access it directly in the template via a getter
}

```

---
## Migrating to Angular Modules
### 1. Create the Root Module (app.module.ts)

You must create a new file `src/app/app.module.ts`. This will act as the central registry for your application.

* **Decorators:** You need `@NgModule`.
* **Declarations:** You must list **all** components that belong to this app (`AppComponent`, `HeaderComponent`, `UserInputComponent`, `InvestmentResultsComponent`).
* **Imports:** You must import global modules here instead of in individual components.
* `BrowserModule`: Required for the app to run in the browser.
* `FormsModule`: Required for `[(ngModel)]` in the User Input component.


* **Bootstrap:** You must tell Angular to start with `AppComponent`.

**Code Example:**

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header.component';
import { UserInputComponent } from './user-input.component';
import { InvestmentResultsComponent } from './investment-results.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UserInputComponent,
    InvestmentResultsComponent
  ],
  imports: [BrowserModule, FormsModule],
  bootstrap: [AppComponent]
})
export class AppModule {}

```

### 2. Update Component Decorators

You must go into **every single component file** (`app.component.ts`, `header.component.ts`, etc.) and strip out the "Standalone" configuration.

* **Remove:** `standalone: true`.
* **Remove:** The `imports: []` array. (The dependencies inside this array, like `FormsModule` or `CurrencyPipe`, are now handled by `AppModule`).

**Before (Standalone):**

```typescript
@Component({
  selector: 'app-user-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: '...'
})
export class UserInputComponent {}

```

**After (Module-based):**

```typescript
@Component({
  selector: 'app-user-input',
  // standalone: true <-- REMOVED
  // imports: [FormsModule] <-- REMOVED
  templateUrl: '...'
})
export class UserInputComponent {}

```

### 3. Update main.ts (Bootstrap Logic)

The entry point must change. Instead of bootstrapping a **component**, you now bootstrap a **module**.

* **Step 1:** Change the import to `platformBrowserDynamic`.
* **Step 2:** Call `bootstrapModule` instead of `bootstrapApplication`.

**Code Example:**

```typescript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule);

```

### 4. Handling Common Directives & Pipes

In the Standalone version, the `InvestmentResultsComponent` likely imported `CurrencyPipe` (or `CommonModule`).

* **Migration:** You do not need to import `CommonModule` explicitly in `AppModule` because `BrowserModule` (which is imported in `AppModule`) already includes everything from `CommonModule`.
* **Result:** Pipes like `currency` and directives like `*ngIf` / `@if` will work automatically in all components declared in `AppModule`.

---

## <a id="section-5"></a>Section 5: Debugging Angular Apps

### 1. Module Introduction

* **Goal:** Learn how to handle errors when your app doesn't work as expected.
* **Types of Errors:**
1. **Compilation Errors:** Prevent the app from starting (usually syntax errors).
2. **Runtime Errors:** Happen in the browser while the app is running (e.g., app crashes).
3. **Logic Errors:** The app runs, but behaves incorrectly (e.g., calculation is wrong).



### 2. Reading & Understanding Error Messages

* **Scenario:** You mistype a variable name or break syntax.
* **Where to look:**
* **Terminal:** The Angular CLI output will show "Build failed" and point to the specific file and line number.
* **Browser Console:** For runtime errors, open Developer Tools (F12) -> Console tab.


* **Example Error:** `Template parse errors: 'app-user' is not a known element`.
* **Meaning:** Angular doesn't recognize the `<app-user>` tag.
* **Fix:** You forgot to import the component (in Standalone) or declare it (in Modules).



### 3. Debugging Logic Errors with the Browser DevTools

* **Scenario:** The app runs, but clicking a button does nothing, or calculates the wrong value.
* **Tool:** The "Sources" tab in Chrome DevTools.
* **Source Maps:** Angular generates "source maps" in development mode. This allows the browser to show your actual TypeScript code (files ending in `.ts`) instead of the compiled JavaScript bundles.
* **Steps:**
1. Open Chrome DevTools -> **Sources**.
2. Press `Ctrl + P` (or `Cmd + P`) to search for a file (e.g., `investment-results.component.ts`).
3. **Set a Breakpoint:** Click on the line number where you suspect the issue (e.g., inside the calculation function).
4. Trigger the action (click "Calculate" in the app).
5. **Paused:** The browser freezes execution at that line. You can now hover over variables to see their current values at that exact moment.



### 4. Using the Angular DevTools Extension

* **Tool:** A browser extension specifically for Angular, developed by the Angular team.
* **Installation:** Install "Angular DevTools" from the Chrome Web Store.
* **Features:**
* **Components Tab:** visualizes the component tree. You can click on any component to see its current state (properties, inputs, outputs) in real-time.
* **Profiler Tab:** Records performance. It shows which change detection cycles ran and how long they took.


* **Usage:**
1. Open DevTools -> Click the **Angular** tab (usually the last one).
2. Select a component in the tree to inspect its `properties`.
3. *Note:* If you change a property value here (e.g., change `enteredInitialInvestment` from 0 to 100), the app updates instantly without reloading.



---


## <a id="section-6"></a>Section 6: Components & Templates 

### 1. Module Introduction

* **Goal:** To look behind the scenes. We know *how* to build components, but now we need to understand how Angular handles **Styles**, **Selectors**, and **Lifecycle Hooks** internally.
* **The Demo App:** We switch to a new project called "Server Manager" (often referenced as `cmp-databinding-start` in older versions or a specific deep-dive project). It involves a dashboard where we can create servers and blueprints.

### 2. Splitting Apps into Components

* **Concept:** The course emphasizes **Separation of Concerns**.
* **Practice:** We start with one giant `AppComponent`. We refactor it by:
1. Creating a `CockpitComponent` (for the input form).
2. Creating a `ServerElementComponent` (for displaying a single server).


* **Data Flow:** We wire them up using `@Input()` (passing data down) and `@Output()` (passing events up), reinforcing the patterns from the Essentials section.

### 3. Component Selectors - Deep Dive

* **Concept:** The `selector` property in the `@Component` decorator is actually a **CSS Selector**. You are not limited to just defining custom HTML tags.
* **Types of Selectors:**
1. **Element Selector (Standard):**
```typescript
selector: 'app-server',
// HTML: <app-server></app-server>

```


2. **Attribute Selector:** (Useful if you want to enhance a standard HTML element).
```typescript
selector: '[app-server]',
// HTML: <div app-server></div>

```


3. **Class Selector:**
```typescript
selector: '.app-server',
// HTML: <div class="app-server"></div>

```




* *Note: ID selectors and Pseudo-selectors are technically possible but not supported/recommended by Angular.*

### 4. Assigning an Alias to Custom Properties (Inputs)

* **Goal:** You might want the public property name (used in the HTML) to be different from the internal variable name (used in TypeScript).
* **Syntax:** Pass a string argument to `@Input()`.
* **Code:**
```typescript
// Inside ServerElementComponent
@Input('srvElement') element: { type: string, name: string, content: string };

```


* **Usage in Parent HTML:**
```html
<app-server-element [srvElement]="serverElement"></app-server-element>

```



### 5. Assigning an Alias to Custom Events (Outputs)

* **Goal:** Same concept as Inputs, but for Outputs.
* **Syntax:** Pass a string argument to `@Output()` or `output()`.
* **Code:**
```typescript
// Inside CockpitComponent
@Output('bpCreated') blueprintCreated = new EventEmitter<{ serverName: string, serverContent: string }>();

```


* **Usage in Parent HTML:**
```html
<app-cockpit (bpCreated)="onBlueprintAdded($event)"></app-cockpit>

```



### 6. View Encapsulation (CSS Scoping)

* **Observation:** If you define `p { color: blue; }` in `app.component.css`, it *only* affects paragraphs in the App Component. It does **not** affect paragraphs in the `ServerElementComponent`.
* **How Angular does it:** Angular emulates Shadow DOM.
* It adds unique attributes to your HTML elements at runtime (e.g., `_ngcontent-ezo-1`).
* It rewrites your CSS to target those attributes (e.g., `p[_ngcontent-ezo-1] { color: blue; }`).


* **Changing Encapsulation:** You can change this behavior via the `encapsulation` property in the decorator.

### 7. More on View Encapsulation

* **Options:**
1. **`ViewEncapsulation.Emulated`** (Default): Styles are scoped to the component.
2. **`ViewEncapsulation.None`**: Styles defined here become **global**. Angular adds them to the `<head>` without any attribute scoping.
3. **`ViewEncapsulation.ShadowDom`**: Uses the browser's native Shadow DOM technology. (Styles are scoped, but different browser implementation).


* **Code Example:**
```typescript
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-server-element',
  templateUrl: './server-element.component.html',
  styleUrls: ['./server-element.component.css'],
  encapsulation: ViewEncapsulation.None // Styles here will affect the WHOLE app
})
export class ServerElementComponent {}

```



### 8. Styling the Host Element (:host)

* **Problem:** Sometimes you want to style the actual custom tag itself (`<app-server-element>`), not just the HTML inside it.
* **Solution:** Use the `:host` pseudo-selector in the component's CSS file.
* **Code (`server-element.component.css`):**
```css
:host {
  display: block;
  border: 1px solid black;
}

```


* **:host-context:** Used to style the host element *only if* it sits inside a specific parent class.
```css
:host-context(.theme-blue) {
  /* Only applies if some parent has class="theme-blue" */
  color: blue;
}

```

---


### 9. Understanding the Component Lifecycle

* **Concept:** Every Angular component goes through a specific lifecycle: it is created, rendered, data-bound properties are updated, and finally, it is destroyed.
* **Hooks:** Angular allows you to "hook" into these phases by defining specific methods in your class.

### 10. Seeing Lifecycle Hooks in Action

To use a hook, you should implement the corresponding interface (e.g., `OnInit`, `OnChanges`) for type safety, though it technically works without it.

#### A. ngOnChanges

* **Trigger:** Called right at the start, and **whenever** one of our bound input properties (`@Input`) changes.
* **Arguments:** Receives a `SimpleChanges` object which holds the current and previous values of the inputs.
* **Code:**
```typescript
import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';

@Component({ selector: 'app-demo', template: '' })
export class DemoComponent implements OnChanges {
  @Input() data: string;

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges called!', changes);
  }
}

```



#### B. ngOnInit

* **Trigger:** Called once the component has been initialized (after the constructor).
* **Usage:** This is where you run initialization logic (like fetching initial data).
* **Note:** The component has been created, but not yet displayed in the DOM.
```typescript
ngOnInit() {
  console.log('ngOnInit called!');
}

```



#### C. ngDoCheck

* **Trigger:** Called during **every** change detection run.
* **Note:** Angular checks for changes frequently (mouse moves, clicks, promises). `ngDoCheck` runs on all of these, even if no data actually changed. It is used for manual change detection logic (rarely used).
```typescript
ngDoCheck() {
  console.log('ngDoCheck called!');
}

```



#### D. ngAfterContentInit

* **Trigger:** Called after content (from `ng-content`) has been projected into the view.
* **Timing:** Runs only once.
```typescript
ngAfterContentInit() {
  console.log('ngAfterContentInit called!');
}

```



#### E. ngAfterContentChecked

* **Trigger:** Called every time the projected content has been checked.
```typescript
ngAfterContentChecked() {
  console.log('ngAfterContentChecked called!');
}

```



#### F. ngAfterViewInit

* **Trigger:** Called after the component's view (and child views) has been fully initialized/rendered.
* **Usage:** You can access DOM elements here (using ViewChild) because they now exist in the DOM.
```typescript
ngAfterViewInit() {
  console.log('ngAfterViewInit called!');
}

```



#### G. ngAfterViewChecked

* **Trigger:** Called every time the view (and child views) have been checked.
```typescript
ngAfterViewChecked() {
  console.log('ngAfterViewChecked called!');
}

```



#### H. ngOnDestroy

* **Trigger:** Called just before the component is removed from the DOM.
* **Usage:** Great for cleanup (unsubscribing from Observables, detaching event listeners) to prevent memory leaks.
```typescript
ngOnDestroy() {
  console.log('ngOnDestroy called!');
}

```



---

### 11. Lifecycle Hooks and Template Access

* **Issue:** If you try to access a DOM element in `ngOnInit`, it might fail because the element hasn't been rendered yet.
* **Solution:** You must wait until `ngAfterViewInit` if you need to access the value of an element in the DOM.

### 12. Getting Access to the Template & DOM with Local References

* **Goal:** We want to get the value of an input field *without* using Two-Way Binding (`[(ngModel)]`).
* **Feature:** **Local Reference**.
* **Syntax:** Add a hashtag `#variableName` to an HTML element.
* **Usage:** You can pass this reference to event handlers in the template.
* **Code (Template):**
```html
<input type="text" #serverNameInput>

<button (click)="onAddServer(serverNameInput)">Add Server</button>

```


* **Code (Class):**
```typescript
onAddServer(nameInput: HTMLInputElement) {
  console.log(nameInput.value);
}

```



### 13. Getting Access to the Template & DOM with @ViewChild

* **Goal:** We want to access that `#serverNameInput` reference inside our TypeScript class, not just pass it in the template.
* **Decorator:** `@ViewChild('selector')`.
* **Argument:** The name of the local reference string.
* **Property Type:** `ElementRef` (A wrapper around the native HTML element).
* **Code:**
```typescript
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

export class CockpitComponent implements AfterViewInit {
  // 1. Select the element
  @ViewChild('serverNameInput') serverContentInput: ElementRef;

  // 2. Access it (Safest in AfterViewInit)
  ngAfterViewInit() {
     console.log(this.serverContentInput.nativeElement.value);
  }

  onAddServer() {
     // You can also access it here on click events
     console.log(this.serverContentInput.nativeElement.value);
  }
}

```


* **Warning:** You should **not** change the DOM directly using this (e.g., `this.serverContentInput.nativeElement.value = 'Something'`). That is bad practice. Use Data Binding for changing values. Use `@ViewChild` primarily for reading values.

---


### 14. Projecting Content into Components with ng-content

* **Scenario:** Previously, our `ServerElementComponent` had a fixed template structure.
* **Goal:** We want to act as a "wrapper" component where the parent defines the HTML content inside the element, similar to how standard HTML tags like `<div>` work.
* **Implementation:**
1. **Parent Template (`app.component.html`):** Place HTML *inside* the custom tags.
```html
<app-server-element *ngFor="let server of serverElements" [srvElement]="server">
    <p>
        <strong *ngIf="server.type === 'server'" style="color: red">{{ server.content }}</strong>
        <em *ngIf="server.type === 'blueprint'">{{ server.content }}</em>
    </p>
</app-server-element>

```


2. **Child Template (`server-element.component.html`):** Use the `<ng-content>` hook.
```html
<div class="panel-body">
    <ng-content></ng-content>
</div>

```





### 15. Understanding @ContentChild

* **Problem:** If you use `@ViewChild` in `ServerElementComponent` to try and select the `<p>` tag inside `<app-server-element>`, it will fail.
* **Reason:** That `<p>` tag is not part of the `ServerElementComponent`'s own *view*. It belongs to the *parent's* template and is merely projected in.
* **Solution:** Use **`@ContentChild`**.
* **Prerequisite:** In the parent HTML, add a local reference to the element being projected.
```html
<app-server-element ...>
    <p #contentParagraph>...</p>
</app-server-element>

```


* **Child Logic:**
```typescript
import { Component, ContentChild, ElementRef, AfterContentInit } from '@angular/core';

export class ServerElementComponent implements AfterContentInit {
  // Select the projected content by its local reference name
  @ContentChild('contentParagraph') paragraph: ElementRef;

  ngAfterContentInit() {
      // This is the earliest moment you can access the content
      console.log('Text Content of Paragraph: ' + this.paragraph.nativeElement.textContent);
  }
}

```



---

### Section Wrap-up

You have now completed the "Deep Dive" into Components.

* **Selectors:** You can select by tag, class, or attribute.
* **Encapsulation:** You can control how styles bleed in or out (`Emulated`, `None`, `ShadowDom`).
* **Lifecycle:** You know exactly when components are created (`ngOnInit`), rendered (`ngAfterViewInit`), and destroyed (`ngOnDestroy`).
* **Access:** You can grab elements from the DOM using `@ViewChild` (for own view) and `@ContentChild` (for projected content).

---

### 16. Component Selectors: Attribute & Class Selectors

*(I touched on this, but here is the specific detail often missed)*

* **Standard:** `selector: 'app-dashboard'` (Element selector).
* **Attribute Selector:** `selector: '[app-dashboard]'`. Useful when you want to turn a standard HTML element (like a `div`) into a component.
```html
<div app-dashboard></div>

```


* **Class Selector:** `selector: '.app-dashboard'`.
```html
<div class="app-dashboard"></div>

```


* **Note:** You cannot use ID selectors.

### 17. Input Transforms

* **Problem:** Sometimes you pass a string `"5"` to an input, but the component needs a number `5`. Or you pass the presence of an attribute (e.g., `<app-card isFeatured />`) which is an empty string, but you want a boolean `true`.
* **Old Way:** Manually converting data in `ngOnChanges`.
* **Modern Way:** Use the `transform` config in the `@Input` decorator.
* **Built-in Transforms:** Angular provides utilities like `booleanAttribute` and `numberAttribute`.
* **Code Example:**
```typescript
import { Component, Input, booleanAttribute, numberAttribute } from '@angular/core';

@Component({ ... })
export class CardComponent {
  // "<app-card isFeatured />" becomes true (instead of "")
  @Input({ transform: booleanAttribute }) isFeatured!: boolean;

  // "<app-card width="50" />" becomes number 50
  @Input({ transform: numberAttribute }) width!: number;
}

```



### 18. Listening to Host Events (@HostListener)

* **Goal:** You want the component to listen to events on *itself* (the `<app-card>` tag), not just elements inside its template.
* **Decorator:** `@HostListener`.
* **Code Example:**
```typescript
import { Component, HostListener } from '@angular/core';

@Component({ ... })
export class CardComponent {
  @HostListener('click') onClick() {
    console.log('Component was clicked!');
  }

  @HostListener('mouseenter') onEnter() {
     console.log('Mouse entered the component area');
  }
}

```



### 19. Binding to Host Properties (@HostBinding)

* **Goal:** You want to dynamically change a CSS class or attribute on the *host element* (`<app-card>`) based on data inside the component.
* **Decorator:** `@HostBinding`.
* **Code Example:**
```typescript
import { Component, HostBinding } from '@angular/core';

export class CardComponent {
  // Adds class="active" to <app-card> if isActive is true
  @HostBinding('class.active') isActive = false; 

  // Sets style="border: 1px solid red" on <app-card>
  @HostBinding('style.border') border = '1px solid red';
}

```



### 20. The Modern "host" Property

* **New Syntax:** Instead of using `@HostListener` and `@HostBinding`, modern Angular prefers defining these in the `@Component` configuration.
* **Code Example:**
```typescript
@Component({
  selector: 'app-card',
  template: '...',
  host: {
    'class': 'user-card', // Static class
    '(click)': 'onCardClick()', // Event listener
    '[class.active]': 'isActive' // Property binding
  }
})
export class CardComponent {
  isActive = true;
  onCardClick() { console.log('Clicked'); }
}

```



### 21. Understanding Two-Way Binding (Deep Dive)

* **Concept:** We know `[(ngModel)]` creates two-way binding. But how?
* **The Pattern:** It is simply a combination of an **Input** named `x` and an **Output** named `xChange`.
* **Manual Implementation:**
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({ ... })
export class SizerComponent {
  @Input() size!: number;
  @Output() sizeChange = new EventEmitter<number>();

  resize(delta: number) {
    this.size = Math.min(40, Math.max(8, +this.size + delta));
    // Emit the new value
    this.sizeChange.emit(this.size);
  }
}

```


* **Usage in Parent:**
```html
<app-sizer [(size)]="fontSizePx" />

```



### 22. Content Projection: Multi-Slot Projection

* **Goal:** Instead of projecting *all* content into one `<ng-content>`, you want to send the Header to one spot and the Body to another.
* **Attribute:** Use the `select` attribute on `<ng-content>`.
* **Parent HTML:**
```html
<app-card>
  <header ngProjectAs="header">My Header</header>
  <div class="body">My Body Content</div>
</app-card>

```


* **Child Template (`card.component.html`):**
```html
<div class="card">
  <div class="card-header">
    <ng-content select="header"></ng-content>
  </div>
  <div class="card-body">
    <ng-content select=".body"></ng-content>
  </div>
</div>

```



### 23. @ContentChild vs @ContentChildren

* **Single:** `@ContentChild` grabs the *first* matching projected element.
* **Multiple:** `@ContentChildren` returns a `QueryList` of *all* matching elements.
* **Usage:**
```typescript
import { ContentChildren, QueryList, AfterContentInit } from '@angular/core';

export class CardComponent implements AfterContentInit {
  @ContentChildren('inputRef') inputs!: QueryList<ElementRef>;

  ngAfterContentInit() {
    // Iterate over all found elements
    this.inputs.forEach(input => console.log(input.nativeElement.value));
  }
}

```



### 24. New Lifecycle Hooks: afterRender & afterNextRender

* **Context:** Introduced in Angular 17. These are not standard component hooks (like `ngOnInit`). They are functions you register in the **constructor** (injection context).
* **Use Case:** They run **only in the browser**, not on the server (useful for SSR safety).
* **afterNextRender:** Runs once after the *next* change detection cycle.
* **afterRender:** Runs after *every* change detection cycle.
* **Code Example:**
```typescript
import { Component, afterNextRender } from '@angular/core';

export class DemoComponent {
  constructor() {
    afterNextRender(() => {
      console.log('rendered!');
      // Safe to access DOM or browser-specific APIs (window, document) here
    });
  }
}

```

---

## <a id="section-7"></a>Section 7: Directives
### 1. Module Introduction & Directive Types

* **Definition:** Directives are instructions in the DOM.
* **Two Main Types:**
1. **Attribute Directives:** Look like a normal HTML attribute. They change the **appearance** or **behavior** of an element (e.g., `ngClass`, `ngStyle`).
2. **Structural Directives:** Look like a normal HTML attribute but have a `*` in front. They change the **DOM structure** (adding/removing elements) (e.g., `*ngIf`, `*ngFor`).


* *(Note: Components are technically directives with a template).*



### 2. Built-in Directives Recap (ngClass & ngStyle)

* **ngClass:** Dynamically adds or removes CSS classes.
```html
<div [ngClass]="{active: isActive}">...</div>

```


* **ngStyle:** Dynamically applies inline styles.
```html
<div [ngStyle]="{backgroundColor: getColor()}">...</div>

```



### 3. Creating a Basic Attribute Directive

* **Goal:** Create a directive `appBasicHighlight` that makes the text background green.
* **Steps:**
1. Create a class and decorate it with `@Directive`.
2. Define a unique `selector` (usually camelCase wrapped in brackets).


* **Injection:** We need access to the element this directive sits on. We inject `ElementRef`.
* **Implementation (Direct Access - *Not Recommended but taught for understanding*):**
```typescript
import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appBasicHighlight]' // Attribute selector
})
export class BasicHighlightDirective implements OnInit {
  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    // Accessing the native element directly
    this.elementRef.nativeElement.style.backgroundColor = 'green';
  }
}

```


* **Usage:**
```html
<p appBasicHighlight>Style me with basic directive!</p>

```



### 4. Better Directive: Using the Renderer2

* **Problem:** Accessing `nativeElement` directly is discouraged. It might break if the app runs in environments without a DOM (like **Service Workers** or **Angular Universal/SSR**).
* **Solution:** Use Angular's `Renderer2` service. It acts as an abstraction layer.
* **Code:**
```typescript
import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appBetterHighlight]'
})
export class BetterHighlightDirective implements OnInit {
  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // Safe styling via Renderer
    this.renderer.setStyle(this.elRef.nativeElement, 'background-color', 'blue');
    this.renderer.setStyle(this.elRef.nativeElement, 'color', 'white');
  }
}

```



### 5. Using HostListener to Listen to Host Events

* **Goal:** We want the background to change *only* when the mouse hovers over the element.
* **Tool:** `@HostListener`. It lets the directive listen to events on the element it is attached to.
* **Code:**
```typescript
import { HostListener } from '@angular/core';

// inside the directive class
@HostListener('mouseenter') mouseover(eventData: Event) {
  this.renderer.setStyle(this.elRef.nativeElement, 'background-color', 'blue');
}

@HostListener('mouseleave') mouseleave(eventData: Event) {
  this.renderer.setStyle(this.elRef.nativeElement, 'background-color', 'transparent');
}

```



### 6. Using HostBinding to Bind to Host Properties

* **Goal:** Changing the style via `renderer.setStyle` is verbose. Is there an easier way to just bind a property (like `style.backgroundColor`) to a variable in our directive?
* **Tool:** `@HostBinding`.
* **How it works:** We define a property in the directive and tell Angular: "Please map this property to the `style.backgroundColor` of the host element."
* **Code:**
```typescript
import { HostBinding } from '@angular/core';

export class BetterHighlightDirective {
  // Bind to the style.backgroundColor property of the host element
  @HostBinding('style.backgroundColor') backgroundColor: string = 'transparent';

  @HostListener('mouseenter') mouseover() {
    this.backgroundColor = 'blue'; // Changing this variable automatically updates the DOM
  }

  @HostListener('mouseleave') mouseleave() {
    this.backgroundColor = 'transparent';
  }
}

```



### 7. Binding to Directive Properties (Custom Input)

* **Goal:** Don't hardcode "blue". Let the user choose the color.
* **Method:** Directives can have `@Input`s just like components.
* **Code:**
```typescript
@Input() defaultColor: string = 'transparent';
@Input() highlightColor: string = 'blue';

@HostBinding('style.backgroundColor') backgroundColor: string;

ngOnInit() {
  this.backgroundColor = this.defaultColor;
}

@HostListener('mouseenter') mouseover() {
  this.backgroundColor = this.highlightColor;
}

```


* **Usage in HTML:**
```html
<p appBetterHighlight [defaultColor]="'yellow'" [highlightColor]="'red'">
  Hover me!
</p>

```



### 8. Binding to the Directive Selector Name (Alias)

* **Trick:** If you have one main property you want to bind, you can alias the `@Input` to share the same name as the directive selector. This makes the syntax cleaner.
* **Code:**
```typescript
// Alias the input 'appBetterHighlight' to the internal property 'highlightColor'
@Input('appBetterHighlight') highlightColor: string = 'blue';

```


* **Usage:**
```html
<p [appBetterHighlight]="'red'" [defaultColor]="'yellow'">
   Cleaner Syntax
</p>

```



---


### 9. What Happens Behind the Scenes with the Asterisk (*)

* **Concept:** When you write `*ngIf="condition"`, Angular transforms it before rendering. The asterisk is just "syntactic sugar" (a shortcut).
* **Transformation:** Angular wraps your element in an `<ng-template>`.
* **The "Short" Way:**
```html
<div *ngIf="isVisible">I am visible</div>

```


* **The "Long" Way (What Angular actually sees):**
```html
<ng-template [ngIf]="isVisible">
  <div>I am visible</div>
</ng-template>

```


* **ng-template:** This is an Angular element that defines a template but does *not* render it by default. It only renders if a directive (like `ngIf`) tells it to.

### 10. Building a Custom Structural Directive

* **Goal:** Create a directive called `appUnless`. It should render content *only if* the condition is **false** (the opposite of `*ngIf`).
* **Requirement:** Because it's a structural directive, we need access to:
1. **`TemplateRef`**: The HTML content inside the directive (the "what").
2. **`ViewContainerRef`**: The place in the DOM where we render it (the "where").



#### Step A: Setup

```typescript
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appUnless]'
})
export class UnlessDirective {
  // Inject the required references
  constructor(
    private templateRef: TemplateRef<any>,
    private vcRef: ViewContainerRef
  ) {}
}

```

#### Step B: Logic (The Input Setter)

We need to run logic whenever the input condition changes. We use a **setter** for the input property.

* *Note: The property name MUST match the selector name (`appUnless`) to use the star syntax (`*appUnless`).*

```typescript
  @Input() set appUnless(condition: boolean) {
    if (!condition) {
      // Condition is FALSE => Show the content
      // createEmbeddedView puts the template into the DOM container
      this.vcRef.createEmbeddedView(this.templateRef);
    } else {
      // Condition is TRUE => Remove the content
      this.vcRef.clear();
    }
  }

```

#### Step C: Usage

```html
<div *appUnless="onlyOdd">
  <h3>Value is Even!</h3>
</div>

```

### 11. ngSwitch

* **Concept:** A built-in directive for handling multiple cases (like a JavaScript `switch` statement).
* **Components:**
* `[ngSwitch]`: Bound to the expression we are checking.
* `*ngSwitchCase`: Shows element if value matches.
* `*ngSwitchDefault`: Shows if no other matches found.


* **Code:**
```html
<div [ngSwitch]="value">
  <p *ngSwitchCase="5">Value is 5</p>
  <p *ngSwitchCase="10">Value is 10</p>
  <p *ngSwitchDefault>Value is Default</p>
</div>

```



---

### Section Wrap-up

You have now mastered Directives.

* **Attribute Directives:** Use `ElementRef` and `Renderer2` to change styles safely. Use `@HostListener` to react to events and `@HostBinding` to control properties.
* **Structural Directives:** Use `TemplateRef` and `ViewContainerRef` to add or remove elements from the DOM manually.

---

## <a id="section-8"></a>Section 8: Transforming Values with Pipes - Deep Dive

### 1. Introduction & What Pipes are

* **Definition:** A Pipe is a feature that allows you to transform a value in an HTML template before it is displayed.
* **Syntax:** It uses the pipe character `|`.
* **Example:** `{{ username | uppercase }}` takes the value of `username`, transforms it to all caps, and displays it. The property `username` in the class remains unchanged.

### 2. Using Built-in Pipes

* **Angular provides several built-in pipes:**
* `uppercase`
* `lowercase`
* `date`
* `currency`
* `percent`
* `json` (Useful for debugging objects)


* **Code Example:**
```html
<p>Unformatted: {{ server.name }}</p>
<p>Formatted: {{ server.name | uppercase }}</p>

```



### 3. Parameterizing Pipes

* **Concept:** Pipes can accept arguments (parameters) to configure their output.
* **Syntax:** Add a colon `:` followed by the value. You can add multiple parameters by adding more colons.
* **Example (Date Pipe):**
```html
<p>{{ server.started }}</p>

<p>{{ server.started | date:'mediumDate' }}</p>

<p>{{ server.started | date:'fullDate' | uppercase }}</p>

```



### 4. Chaining Pipes

* **Concept:** You can apply multiple pipes to the same output. They are executed from left to right.
* **Example:**
```html
<p>{{ server.started | date:'fullDate' | uppercase }}</p>

```


*Note: Order matters! If you swapped them (`uppercase | date`), it would fail because `uppercase` works on strings, but `date` might expect a Date object (though `date` pipe is robust, logic applies).*

### 5. Creating a Custom Pipe

* **Goal:** Create a pipe named `shorten` that truncates a string if it's longer than a certain limit (e.g., "Hello World" -> "Hello ...").
* **Step 1: Create the Class:**
* Decorate with `@Pipe`.
* Implement `PipeTransform` interface.
* Define the `transform` method.


* **Code (`shorten.pipe.ts`):**
```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten' // This is the name used in HTML
})
export class ShortenPipe implements PipeTransform {
  // transform(value: any, ...args: any[])
  transform(value: any, limit: number = 10): any {
    if (value.length > limit) {
      return value.substr(0, limit) + ' ...';
    }
    return value;
  }
}

```


* **Step 2: Register the Pipe:**
* **Legacy:** Add it to `declarations` in `app.module.ts`.
* **Modern:** Add `standalone: true` to the pipe decorator or import it in the component.


* **Step 3: Use it:**
```html
<p>{{ server.name | shorten:5 }}</p>

```



### 6. Filtering Lists with Pipes (Impure Pipes)

* **Goal:** Create a `filter` pipe to show only servers with a specific status (e.g., 'stable') when the user types in an input field.
* **Code (Filter Pipe):**
```typescript
@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform(value: any, filterString: string, propName: string): any {
    if (value.length === 0 || filterString === '') {
      return value;
    }
    const resultArray = [];
    for (const item of value) {
      if (item[propName] === filterString) {
        resultArray.push(item);
      }
    }
    return resultArray;
  }
}

```


* **Usage:**
```html
<input type="text" [(ngModel)]="filteredStatus">
<div *ngFor="let server of servers | filter:filteredStatus:'status'">
  ...
</div>

```



### 7. Pure vs. Impure Pipes (Performance Issue)

* **The Problem:** If you add a new server to the list using a button, the `filter` pipe **does not** update the view. The new server doesn't appear even if it matches the filter.
* **Reason:** By default, pipes are **Pure**.
* **Pure Pipe:** Only recalculates if the *input reference* changes (e.g., the string value changes or the array reference is replaced). It ignores changes *inside* the array (pushing an item).


* **Fix (Impure Pipe):** You can force the pipe to run on every change detection cycle (keystroke, mouse move, etc.).
* **Syntax:** `pure: false` in the decorator.
```typescript
@Pipe({
  name: 'filter',
  pure: false // WARNING: High Performance Cost
})
export class FilterPipe { ... }

```


* **Warning:** Use impure pipes cautiously. Running a filter loop on every mouse move can freeze your app if the dataset is large. The course often recommends filtering logic in the *Service* or *Component* instead of a Pipe for this reason.

### 8. The Async Pipe

* **Concept:** Handling asynchronous data (Promises or Observables) usually requires `subscribe()` in the TS file and storing the result in a variable. The `async` pipe handles this automatically in the template.
* **Features:**
* Subscribes to the Observable/Promise.
* Returns the emitted value.
* **Automatically Unsubscribes** when the component is destroyed (prevents memory leaks).


* **Code:**
```typescript
// Component
appStatus = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('stable');
  }, 2000);
});

```


```html
<h2>App Status: {{ appStatus | async }}</h2>

```


*(Initially empty, after 2 seconds updates to 'stable')*

---

**Section Wrap-up:**
You have learned how to format data for the user view.

* **Standard:** Use `date`, `uppercase`, etc.
* **Custom:** Implement `PipeTransform`.
* **Performance:** Be careful with `pure: false`.
* **Async:** Use `| async` to handle Observables cleanly in the view.

---


## <a id="section-9"></a>Section 9: Services & Dependency Injection

### 1. Introduction & Why Services?

* **Problem:** You have code (like logging to the console) duplicated in multiple components.
* **Solution:** Centralize that code in a **Service** class.
* **Principles:**
* **DRY (Don't Repeat Yourself):** Write logic once, use everywhere.
* **Separation of Concerns:** Components manage the View (HTML); Services manage the Logic/Data.



### 2. Creating a Basic Logging Service

* **Goal:** Create a service that logs status changes to the console.
* **Step 1:** Define the class. It doesn't strictly *need* a decorator if it doesn't receive other dependencies, but it's good practice.
* **Code (`logging.service.ts`):**
```typescript
export class LoggingService {
  logStatusChange(status: string) {
    console.log('A server status changed, new status: ' + status);
  }
}

```



### 3. Injecting the Service into a Component

* **Step 1: Import:** Import the class in your component.
* **Step 2: Provide:** Add it to the `providers` array in the `@Component` decorator.
* **Step 3: Inject:** Add it to the `constructor` with a type annotation.
* **Code (`new-account.component.ts`):**
```typescript
import { Component } from '@angular/core';
import { LoggingService } from './logging.service';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  // We tell Angular how to create the service here
  providers: [LoggingService] 
})
export class NewAccountComponent {
  // Angular instantiates the service and gives it to us
  constructor(private loggingService: LoggingService) {}

  onCreateAccount(accountName: string, accountStatus: string) {
    this.loggingService.logStatusChange(accountStatus);
  }
}

```



### 4. Creating a Data Service

* **Goal:** Move the list of accounts (data) out of `AppComponent` and into `AccountsService` so it can be shared.
* **Code (`accounts.service.ts`):**
```typescript
export class AccountsService {
  accounts = [
    { name: 'Master Account', status: 'active' },
    { name: 'Testaccount', status: 'inactive' }
  ];

  addAccount(name: string, status: string) {
    this.accounts.push({ name, status });
  }

  updateStatus(id: number, newStatus: string) {
    this.accounts[id].status = newStatus;
  }
}

```



### 5. Understanding the Hierarchical Injector (Theory)

* **Crucial Concept:** Angular's DI system is hierarchical. The instance of the service you get depends on *where* you provide it.

1. **AppModule (Root):**
* If provided here (or `providedIn: 'root'`), the service is available **application-wide**.
* **Singleton:** The *same* instance is shared by everyone.


2. **AppComponent:**
* If provided here, the service is available to `AppComponent` and **all its child components**.
* It overrides the Root instance (if any).


3. **Any Other Component:**
* If provided here, the service is available to **this component and its children**.
* **New Instance:** Angular creates a *new, separate instance* for this component tree.



### 6. The Problem with Multiple Instances

* **Scenario:**
* You provide `AccountsService` in `NewAccountComponent` (`providers: [AccountsService]`).
* You *also* provide `AccountsService` in `AppComponent`.


* **Result:** When `NewAccountComponent` adds an account, it pushes it to its *own private instance* of the service. The `AppComponent` (which displays the list) looks at a *different instance*, so the list never updates.
* **Fix:** **Remove** the service from the `providers` array of the child components. Keep it **only** in the parent (`AppComponent`) or Root.

---


### 7. Injecting Services into Services

* **Scenario:** We want to use our `LoggingService` *inside* our `AccountsService` (e.g., to log a message whenever an account is added).
* **Problem:** You cannot just add `constructor(private log: LoggingService)` to a plain class. Angular's DI system needs to know that `AccountsService` is a candidate for injection.
* **The `@Injectable` Decorator:**
* In modern Angular, we recommend adding `@Injectable()` to *every* service.
* **Rule:** It is **mandatory** if a service receives another service via dependency injection.
* *Note: Components don't need `@Injectable` because `@Component` is a subtype of it.*


* **Code (`accounts.service.ts`):**
```typescript
import { Injectable } from '@angular/core';
import { LoggingService } from './logging.service';

@Injectable() // Mandatory because we inject LoggingService
export class AccountsService {
  constructor(private loggingService: LoggingService) {}

  addAccount(name: string, status: string) {
    this.accounts.push({ name, status });
    // Using the injected service
    this.loggingService.logStatusChange(status);
  }
}

```


* **Provisioning:** Remember to provide **both** services in `AppModule` (or `AppComponent`) to ensure the injector can find them.

### 8. Using Services for Cross-Component Communication

* **Goal:** Trigger an action in `AccountComponent` (like an alert) when a button is clicked in `NewAccountComponent`, *without* chaining multiple `@Input` and `@Output` through the parent.
* **Pattern:** Use an `EventEmitter` (or Subject) inside the Service.
* **Step 1: Define the Event in Service:**
```typescript
// accounts.service.ts
import { EventEmitter } from '@angular/core';

export class AccountsService {
  statusUpdated = new EventEmitter<string>();
  // ... rest of code
}

```


* **Step 2: Emit the Event (Sender Component):**
```typescript
// new-account.component.ts
constructor(private accountsService: AccountsService) {}

onSetStatus(status: string) {
  this.accountsService.statusUpdated.emit(status);
}

```


* **Step 3: Subscribe to the Event (Receiver Component):**
```typescript
// account.component.ts
constructor(private accountsService: AccountsService) {
  this.accountsService.statusUpdated.subscribe(
    (status: string) => alert('New Status: ' + status)
  );
}

```



### 9. Modern Provisioning: `providedIn: 'root'`

* **Evolution:** In older Angular versions (Angular 2-5), you *had* to list services in the `providers` array of a Module or Component.
* **Modern Standard (Angular 6+):** The preferred way is to configure the provider inside the service decorator itself.
* **Benefits:**
* **Tree Shaking:** If the service is never used, it is removed from the final bundle.
* **Singleton:** Automatically makes it a singleton available app-wide (equivalent to providing in `AppModule`).


* **Code:**
```typescript
@Injectable({
  providedIn: 'root'
})
export class AccountsService { ... }

```



### 10. The `inject()` Function (Modern Alternative)

* **Context:** Introduced in Angular 14. Allows injection without a constructor.
* **Usage:**
```typescript
import { inject } from '@angular/core';

export class AccountComponent {
  private accountsService = inject(AccountsService);

  // Logic remains the same
}

```


* **Benefit:** Very useful for **functional** guards, interceptors, and cleaner class inheritance (no need to call `super()` with dependencies).

---

### Section Wrap-up

You have learned that the **Dependency Injector** is hierarchical.

* **Singleton:** Provide in `'root'` or `AppModule`.
* **Isolated Instance:** Provide in a Component's `providers: []`.
* **Service-in-Service:** Use `@Injectable()` and constructor injection.

---

## <a id="section-10"></a>Section 10: Change Detection

### 1. Introduction: How Change Detection Works

* **The Concept:** Angular needs to keep your HTML (View) in sync with your TypeScript (Model). When a property changes in your class (e.g., `isLoading = false`), the DOM must update to remove the loading spinner.
* **The Mechanism:** Angular does **not** constantly poll for changes. Instead, it relies on **Signals** (events).
* **Triggers:** Change detection is triggered by asynchronous browser events:
1. User Events (`click`, `submit`, `mouseover`).
2. Timers (`setTimeout`, `setInterval`).
3. HTTP Requests (XHR/Fetch).



### 2. Zone.js: The Magic Behind the Scenes

* **Definition:** Angular uses a library called `Zone.js`.
* **Role:** Zone.js "monkey patches" (overrides) all standard browser asynchronous functions (like `addEventListener` or `setTimeout`).
* **Flow:**
1. You write `setTimeout(...)` in your component.
2. Zone.js intercepts this call.
3. Zone.js notifies Angular: *"Hey, an async operation just finished!"*
4. Angular runs its **Tick** (Change Detection Cycle) to check every component for updates.



### 3. The Default Change Detection Strategy

* **Behavior:** By default, when *any* event happens anywhere in the app, Angular checks the **entire** component tree from top to bottom.
* **Performance:** Angular is very fast, so checking the whole tree usually happens in milliseconds. However, in large apps with huge lists or complex calculations, this can become a performance bottleneck.
* **Code Example (Default):**
```typescript
@Component({
  selector: 'app-default',
  template: '{{ data.name }}',
  // Default strategy is implied if not specified
  // changeDetection: ChangeDetectionStrategy.Default
})
export class DefaultComponent {
  @Input() data: { name: string };
}

```



### 4. Understanding Object Mutability vs. Immutability

To understand the next topic (`OnPush`), we must understand how JavaScript handles objects.

* **Reference Types:** Objects and Arrays are reference types.
* **Mutation:** Changing a property inside an object does **not** change the reference (memory address) of the object itself.
```typescript
let user = { name: 'Max' };
user.name = 'Anna'; 
// The object is MUTATED, but 'user' variable still points to the same memory address.

```


* **Immutability:** Creating a new object instead of changing the old one.
```typescript
let user = { name: 'Max' };
user = { name: 'Anna' }; 
// The reference CHANGED. 'user' points to a new memory address.

```



### 5. Optimizing with `ChangeDetectionStrategy.OnPush`

* **Goal:** Tell Angular to ignore this component (and its children) during the global check *unless* specific conditions are met.
* **Setup:** Change the strategy in the `@Component` decorator.
* **Code:**
```typescript
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-on-push',
  template: '{{ data.name }}',
  // Switch to OnPush
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnPushComponent {
  @Input() data: { name: string };
}

```



### 6. How `OnPush` Actually Works (The Rules)

When a component uses `OnPush`, Angular will **skip** checking it unless:

1. **The Input Reference Changes:** The `@Input` property receives a completely *new* object/value (new memory address).
2. **An Event Originated inside the Component:** The user clicked a button *inside* this specific component.
3. **The Async Pipe emits:** An Observable subscribed via `| async` emits a new value.
4. **Manual Trigger:** You manually tell Angular to check (covered in Part 2).

### 7. The "Trap": Mutating Objects with OnPush

* **Scenario:** You have a parent component passing an object to an `OnPush` child.
* **Action:** You update the object's property in the parent.
* **Result:** The Child **does not update**.
* **Why?** Angular looks at the Input. It sees the object reference is the *same* (even though a property inside changed). Because it's `OnPush`, Angular assumes "Same Reference = No Change" and skips the update to save performance.

**Code Example of the Issue:**

```typescript
// Parent Component (Default Strategy)
@Component({
  template: `
    <button (click)="changeName()">Change Name</button>
    <app-on-push [data]="user"></app-on-push>
  `
})
export class ParentComponent {
  user = { name: 'Max' };

  changeName() {
    // MUTATION: We change the property, but 'this.user' is the SAME object
    this.user.name = 'Anna'; 
    // Result: Child component will NOT update because reference didn't change.
  }
}

```

---

### 8. Fixing the "OnPush" Issue with Immutability

* **Goal:** We want the `OnPush` child component to update when we change the data in the parent.
* **Solution:** Instead of mutating the existing object, we must replace it with a **new object** (new memory reference).
* **Code (Parent Component):**
```typescript
changeName() {
  // BAD (Mutation - OnPush ignores this):
  // this.user.name = 'Anna';

  // GOOD (Immutability - OnPush detects this):
  // We create a new object, copying old properties (...) and overriding name
  this.user = { ...this.user, name: 'Anna' };
}

```


* **Result:** Angular sees that the `[data]` input has a new reference address, so it triggers change detection for the `OnPush` child.

### 9. Triggering Change Detection Manually (ChangeDetectorRef)

* **Scenario:** Sometimes you *must* mutate data, or the update comes from a source Angular doesn't know about (like a third-party library that runs outside Zone.js). The UI won't update.
* **Tool:** `ChangeDetectorRef`.
* **Method 1: `markForCheck()**`
* **Usage:** Tells Angular, "The next time you run a check cycle, please check *me* (this component), even if my Inputs didn't change."
* **Common Use Case:** When using `OnPush` but updating data via an Observable subscription inside the component (not via Async pipe).
* **Code:**
```typescript
import { Component, ChangeDetectorRef, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-manual',
  template: '{{ data }}',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManualComponent implements OnInit {
  data = 'Initial';

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    setTimeout(() => {
      // We mutate data (or set it without Input change)
      this.data = 'Updated via Timeout';

      // With OnPush, the view might NOT update automatically here.
      // We manually mark it for the next check:
      this.cdRef.markForCheck(); 
    }, 2000);
  }
}

```





### 10. Detaching and Reattaching (Advanced Performance)

* **Goal:** Completely disable change detection for a component to save resources, and only enable it when absolutely necessary.
* **Methods:**
* `detach()`: Removes the component from the change detection tree. Angular will **never** check it automatically.
* `detectChanges()`: Triggers an immediate check for this component and its children.
* `reattach()`: Adds it back to the tree.


* **Code:**
```typescript
constructor(private cdRef: ChangeDetectorRef) {
  // 1. Stop checking this component automatically
  this.cdRef.detach();
}

onHeavyCalculationFinished() {
  // 2. We finished complex logic, now update the UI once
  this.cdRef.detectChanges();
}

```



### 11. Avoiding Zone Pollution with `runOutsideAngular`

* **Scenario:** You have a high-frequency event, like `window.onscroll` or `mousemove`, that fires hundreds of times a second.
* **Problem:** Every time the event fires, Zone.js tells Angular to run a full Change Detection cycle. This kills performance.
* **Solution:** Use `NgZone.runOutsideAngular`.
* **Concept:** Run the code *outside* of Angular's Zone. Angular will not know the event happened, so it won't trigger a check.
* **Code:**
```typescript
import { Component, NgZone, OnInit } from '@angular/core';

@Component({ ... })
export class ScrollComponent implements OnInit {
  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    // Run this logic OUTSIDE Angular's awareness
    this.ngZone.runOutsideAngular(() => {

      window.addEventListener('scroll', () => {
        // This code runs on every scroll
        console.log('Scrolling...'); 
        // Angular does NOT run change detection here.

        // If we decide we DO need to update the UI eventually:
        if (window.scrollY > 500) {
          // Jump back INSIDE the zone to update the UI
          this.ngZone.run(() => {
            this.showButton = true;
          });
        }
      });

    });
  }

  showButton = false;
}

```



---

### Section Wrap-up

You have learned how to take control of Angular's update cycle.

* **Default:** Checks everything, safe but potentially slow.
* **OnPush:** Checks only on Input reference change or Events. Fast.
* **Immutability:** Essential for OnPush. Always create new objects (`{...obj}`) instead of mutating.
* **Manual Control:** Use `markForCheck()` if OnPush blocks an update you need. Use `runOutsideAngular` to silence noisy events.

---
## <a id="section-11"></a>Section 11: Working with RxJS

### 1. Introduction: What are Observables?

* **Definition:** An Observable is a data source. It is a stream of data that arrives over time.
* **Analogy:** Think of it like a Newsletter.
* **Observable:** The Publisher (sends out issues).
* **Observer:** The Subscriber (reads the issues).
* **Subscription:** The contract linking the two.


* **Key Difference from Promises:**
* **Promise:** Resolves once (one single value), then it's done.
* **Observable:** Can emit multiple values over time (0, 1, many, or error).



### 2. Angular's Built-in Observables

* **Context:** You have already used Observables without knowing it.
* **Example:** `params` in ActivatedRoute.
* **Code:**
```typescript
ngOnInit() {
  // Angular "pushes" new data here whenever the URL parameter changes
  this.route.params.subscribe((params) => {
    console.log(params['id']);
  });
}

```



### 3. Creating a Custom Observable

* **Goal:** Create an Observable from scratch that emits a count (0, 1, 2...) every second.
* **Function:** We use the `Observable` constructor (or creation functions like `interval`).
* **The `observer` argument:** The function inside receives an `observer`. We use this object to push data.
* **Code:**
```typescript
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({ ... })
export class HomeComponent implements OnInit {

  ngOnInit() {
    // Create the Observable
    const customIntervalObservable = new Observable(observer => {
      let count = 0;
      setInterval(() => {
        // 1. Emit a value (The "Next" signal)
        observer.next(count);

        // 2. Example: Complete the stream after 2 seconds
        if (count === 2) {
          observer.complete(); 
        }

        // 3. Example: Throw an error if count > 3
        if (count > 3) {
          observer.error(new Error('Count is greater than 3!'));
        }

        count++;
      }, 1000);
    });

    // Subscribe to listen
    customIntervalObservable.subscribe({
      next: (data) => console.log(data),      // Handle Data
      error: (error) => alert(error.message), // Handle Error
      complete: () => console.log('Completed!') // Handle Completion
    });
  }
}

```



### 4. Handling Errors & Completion

* **Next (`observer.next`):** Normal data emission.
* **Error (`observer.error`):** Something went wrong. **Important:** An error *kills* the observable. It stops emitting immediately and never completes.
* **Complete (`observer.complete`):** The stream is finished successfully. No more data will be emitted.

### 5. Understanding Subscriptions & Memory Leaks

* **Problem:** If you navigate *away* from `HomeComponent`, the `setInterval` inside our custom observable keeps running.
* **Consequence:** This is a **Memory Leak**. The console keeps logging "0, 1, 2..." even though the component is destroyed.
* **Solution:** You must **Unsubscribe**.
* **Step 1:** Store the subscription in a variable of type `Subscription`.
* **Step 2:** Call `.unsubscribe()` in `ngOnDestroy`.
* **Code:**
```typescript
import { Subscription } from 'rxjs';

export class HomeComponent implements OnInit, OnDestroy {
  private firstObsSubscription: Subscription;

  ngOnInit() {
    const customObs = ...; // (as defined above)

    // Store the subscription
    this.firstObsSubscription = customObs.subscribe(data => {
      console.log(data);
    });
  }

  ngOnDestroy() {
    // Clean up whenever the component is removed
    this.firstObsSubscription.unsubscribe();
  }
}

```


* *Note: Angular's built-in observables (like `route.params` or `http.get`) automatically unsubscribe for you. You only need to manually unsubscribe from custom ones.*


### 6. Understanding Operators

* **Definition:** Operators are functions that allow you to transform, filter, or manipulate the data stream *before* it reaches the subscription.
* **Usage:** You use the `.pipe()` method on an Observable to chain operators together.
* **Analogy:** Think of a water pipe. The water (data) flows through, but you add a filter (Operator) to clean it before it comes out of the tap (Subscription).

### 7. The `map` Operator

* **Goal:** Transform the data emitted by the Observable into a new format.
* **Scenario:** Our custom interval emits `0, 1, 2...`. We want to transform it to return a string: `"Round: 0", "Round: 1"`.
* **Code:**
```typescript
import { map } from 'rxjs/operators';

// ... inside ngOnInit
this.firstObsSubscription = customIntervalObservable.pipe(
  map((data: number) => {
    return 'Round: ' + (data + 1);
  })
).subscribe(data => {
  console.log(data); // Output: "Round: 1", "Round: 2"...
});

```



### 8. The `filter` Operator

* **Goal:** Only allow certain data to pass through.
* **Scenario:** We only want to log the data if the number is greater than 0.
* **Code:**
```typescript
import { filter, map } from 'rxjs/operators';

this.firstObsSubscription = customIntervalObservable.pipe(
  filter((data: number) => {
    return data > 0; // Only emit if true
  }),
  map((data: number) => {
    return 'Round: ' + (data + 1);
  })
).subscribe(data => {
  console.log(data);
});

```


* **Order Matters:** Operators execute inside `pipe()` from top to bottom. If `filter` drops a value, `map` never sees it.

### 9. Subjects (A Special Type of Observable)

* **Definition:** A Subject is both an **Observable** (you can subscribe to it) and an **Observer** (you can emit events using `.next()`).
* **Why use it?** It is the standard way to handle **Cross-Component Communication** via Services in Angular.
* **EventEmitter vs. Subject:**
* **Use `EventEmitter`:** Only for `@Output()` in components.
* **Use `Subject`:** For cross-component communication via Services.



### 10. Refactoring: Replacing EventEmitter with Subject

* **Scenario:** In the previous Service section, we used `new EventEmitter<string>()` in our `UserService` to notify when a user was activated. We will replace this with a Subject.
* **Step 1: The Service (Create Subject):**
```typescript
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'; // Import from rxjs, NOT @angular/core

@Injectable({providedIn: 'root'})
export class UserService {
  // activatedEmitter = new EventEmitter<boolean>(); // OLD WAY
  activatedSubject = new Subject<boolean>();         // NEW WAY
}

```


* **Step 2: The Emitter (Using .next):**
```typescript
// In user.component.ts
onActivate() {
  // this.userService.activatedEmitter.emit(true); // OLD
  this.userService.activatedSubject.next(true);    // NEW
}

```


* **Step 3: The Subscriber (Using .subscribe):**
```typescript
// In app.component.ts
ngOnInit() {
  this.sub = this.userService.activatedSubject.subscribe(didActivate => {
    if (didActivate) {
      this.userActivated = true;
    }
  });
}

ngOnDestroy() {
  // IMPORTANT: You MUST unsubscribe manually from Subjects!
  // (EventEmitters didn't require this, but Subjects do)
  this.sub.unsubscribe();
}

```



### 11. BehaviorSubjects (Holding a Value)

* *Note: Often covered in advanced sections or updates.*
* **Problem:** Standard `Subject` has no memory. If you subscribe *after* the event happened, you missed it.
* **Solution:** `BehaviorSubject`.
* **Features:**
* Requires an initial value (e.g., `new BehaviorSubject<boolean>(false)`).
* When a new component subscribes, it **immediately** receives the last emitted value.


* **Code:**
```typescript
// Initial value is 'false'
activatedSubject = new BehaviorSubject<boolean>(false); 

```



---

### Section Wrap-up

* **Observables:** Streams of data.
* **Subscription:** `.subscribe()` to start the stream.
* **Operators:** `.pipe(map, filter)` to transform data.
* **Subjects:** The "active" tool for Service communication. Always remember to `.unsubscribe()`!

---
## <a id="section-11.1"></a>RxJS Operators

### 1. `map`

* **Explanation:** Transforms the data emitted by an Observable into a new format. It takes the value, applies a function to it, and returns the result.
* **When to Use:** Whenever the data you get from a source (like an API) isn't in the exact format your component needs.
* *Example:* Converting a raw JSON object `{ name: 'Max', id: 1 }` into just the string `"Max"`.


* **Code Example:**
```typescript
import { map } from 'rxjs/operators';

myObservable.pipe(
  map(data => {
    return 'Transformed Data: ' + data;
  })
).subscribe(result => console.log(result));

```



### 2. `filter`

* **Explanation:** Acts like a gate. It checks the emitted data against a condition. If the condition is `true`, the data passes through. If `false`, the data is discarded and nothing reaches the subscription.
* **When to Use:** When you want to ignore certain values.
* *Example:* You have a user input stream, but you only want to trigger a search if the user has typed more than 3 characters.


* **Code Example:**
```typescript
import { filter } from 'rxjs/operators';

myObservable.pipe(
  filter(num => num > 0) // Only allow positive numbers
).subscribe(result => console.log(result));

```



### 3. `tap` (formerly `do`)

* **Explanation:** A utility operator that allows you to "spy" on the stream without changing it. It executes code (side effects) but returns the exact same data it received.
* **When to Use:**
* **Debugging:** To `console.log` data at different stages of the pipe to see what's happening.
* **Side Effects:** To perform an action outside the stream (e.g., updating a separate UI element or sending a logging signal) without altering the main data flow.


* **Code Example:**
```typescript
import { tap, map } from 'rxjs/operators';

myObservable.pipe(
  tap(data => console.log('Raw Data: ' + data)), // Spy here
  map(data => data * 2),
  tap(data => console.log('Modified Data: ' + data)) // Spy again
).subscribe();

```



### 4. `take`

* **Explanation:** It takes exactly `n` values from the Observable and then **automatically completes** (unsubscribes).
* **When to Use:**
* When you only need the data *once* (e.g., getting the current user state to initialize a component).
* It effectively prevents memory leaks because you don't need to manually unsubscribe in `ngOnDestroy`.


* **Code Example:**
```typescript
import { take } from 'rxjs/operators';

// Even if this observable emits forever, we stop after 1
myIntervalObservable.pipe(
  take(1) 
).subscribe(data => {
  console.log(data); // Prints once, then closes connection
});

```



### 5. `debounceTime`

* **Explanation:** It waits for a specific pause in emissions before passing the latest value. If a new value arrives before the timer runs out, the timer resets.
* **When to Use:** **Forms and Search Inputs**. If a user types "Apple" quickly, you don't want to send 5 API requests ("A", "Ap", "App"...). You want to wait until they stop typing for 500ms and send only one request for "Apple".
* **Code Example:**
```typescript
import { debounceTime } from 'rxjs/operators';

searchParam.valueChanges.pipe(
  debounceTime(500) // Wait 500ms of silence
).subscribe(term => {
  // Send HTTP request
});

```



### 6. `distinctUntilChanged`

* **Explanation:** It blocks a value if it is exactly the same as the *previous* value.
* **When to Use:** Often combined with `debounceTime` in search forms. If a user types "Apple", pauses (request sent), types "Apples", then deletes "s" (back to "Apple"), you might not want to send the same request again.
* **Code Example:**
```typescript
import { distinctUntilChanged } from 'rxjs/operators';

myObservable.pipe(
  distinctUntilChanged()
).subscribe();

```



### 7. `catchError`

* **Explanation:** It intercepts an error in the Observable chain. You can then log the error and return a "fallback" Observable (like a default value) so the stream doesn't crash completely.
* **When to Use:** **HTTP Requests**. If the server returns a 500 error, you don't want the app to break. You want to catch it and show a user-friendly message.
* **Code Example:**
```typescript
import { catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

http.get('...').pipe(
  catchError(errorRes => {
    // Return a new observable with a safe default value
    return of([]); 
    // OR re-throw it to handle it in the subscribe block
    // return throwError(() => new Error(errorRes));
  })
).subscribe();

```



---

### The "Flattening" Operators (Crucial for HTTP)

Max emphasizes these three operators heavily in the HTTP and Authentication sections. They are used when one Observable (e.g., a click) triggers another Observable (e.g., an HTTP request).

### 8. `switchMap`

* **Explanation:** When a new value arrives, it **cancels** the previous inner Observable (if it's still running) and switches to the new one.
* **When to Use:** **Search Typeaheads**.
* User types "A" -> Request 1 starts.
* User types "B" (now "AB") -> Request 1 is **cancelled**, Request 2 starts.
* This ensures you never show results from an old, stale request.


* **Code Example:**
```typescript
import { switchMap } from 'rxjs/operators';

route.params.pipe(
  // If user switches ID fast, cancel the old HTTP fetch
  switchMap(params => {
    return this.http.get('/user/' + params['id']);
  })
).subscribe(userData => { ... });

```



### 9. `exhaustMap`

* **Explanation:** If an inner Observable is running, it **ignores** any new incoming values until the current one finishes.
* **When to Use:** **Login Buttons**.
* User clicks "Login" -> Request starts.
* User impatiently spam-clicks "Login" 5 more times -> `exhaustMap` ignores these clicks because the first login request is still pending.
* This prevents sending multiple duplicate transactions.


* **Code Example:**
```typescript
import { exhaustMap, take } from 'rxjs/operators';

this.authService.user.pipe(
  take(1),
  exhaustMap(user => {
    // Wait for this HTTP call to finish before accepting new clicks
    return this.http.get('...'); 
  })
).subscribe();

```



### 10. `concatMap`

* **Explanation:** It queues requests. It waits for the current inner Observable to complete before starting the next one.
* **When to Use:** **Order of operations matters**.
* Example: An "Upload Queue". You want File 1 to finish uploading completely before File 2 starts. You typically don't want to run them in parallel or cancel the previous one.


* **Code Example:**
```typescript
import { concatMap } from 'rxjs/operators';

clicks.pipe(
  concatMap(click => this.http.post('/save', click))
).subscribe();

```

---

## <a id="section-12"></a>Section 12: Sending HTTP Requests

### 1. Module Introduction & The "Backend"

* **Concept:** Angular is a client-side framework. It runs in the user's browser. It cannot connect directly to a database (SQL/MongoDB) because that would expose your database credentials to the world.
* **Solution:** Angular sends HTTP Requests (GET, POST, etc.) to a **Server (API)**, and the Server interacts with the Database.
* **Course Backend:** We use **Firebase** (Google's backend-as-a-service).
* **Requirement:** The URL must end with `.json` (specific to Firebase's REST API).



### 2. Setup: Adding the HTTP Client

Before you can use HTTP, you must unlock the capability in your app.

* **Modern Approach (Standalone):**
In `app.config.ts` (or `main.ts`), add `provideHttpClient()`.
```typescript
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient() 
    // ...other providers
  ]
};

```


* **Legacy Approach (Modules):**
In `app.module.ts`, import `HttpClientModule`.
```typescript
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  imports: [HttpClientModule, ...]
})
export class AppModule {}

```



### 3. Sending a POST Request

* **Goal:** Save a user's post (Title + Content) to the server.
* **Step 1: Inject HttpClient:**
```typescript
constructor(private http: HttpClient) {}

```


* **Step 2: Send Request:**
* Method: `post(url, body)`.
* **Crucial Rule:** Angular's Http methods return an **Observable**. If you do not `.subscribe()` to it, the request is **never sent**. Angular assumes that if no one is listening, the request is unnecessary.


* **Code:**
```typescript
onCreatePost(postData: { title: string; content: string }) {
  this.http
    .post(
      'https://your-project-id.firebaseio.com/posts.json',
      postData
    )
    .subscribe(responseData => {
      console.log(responseData);
    });
}

```



### 4. Sending a GET Request

* **Goal:** Fetch all saved posts from the server.
* **Method:** `get(url)`.
* **Code:**
```typescript
private fetchPosts() {
  this.http
    .get('https://your-project-id.firebaseio.com/posts.json')
    .subscribe(posts => {
      console.log(posts);
    });
}

```



### 5. Transforming Data with the `map` Operator

* **Problem:** Firebase returns data in a confusing format. It returns an object where keys are IDs:
```json
{
  "-N7a8s9d": { "title": "First", "content": "..." },
  "-N7b9s1a": { "title": "Second", "content": "..." }
}

```


* **Goal:** We want a clean Array: `[{ id: '-N7...', title: 'First' }, ...]`.
* **Solution:** Use the RxJS `map` operator to transform the response *before* it reaches the subscription.
* **Code:**
```typescript
import { map } from 'rxjs/operators';

this.http
  .get('https://.../posts.json')
  .pipe(
    map((responseData: {[key: string]: Post}) => {
      const postsArray: Post[] = [];
      for (const key in responseData) {
        if (responseData.hasOwnProperty(key)) {
          // Push a new object containing the ID (key) and the data (...)
          postsArray.push({ ...responseData[key], id: key });
        }
      }
      return postsArray;
    })
  )
  .subscribe(posts => {
    // Now 'posts' is a nice array we can loop over with *ngFor
    this.loadedPosts = posts;
  });

```



### 6. Using Types with HttpClient

* **Best Practice:** Don't leave your response as `any`. Angular's Http methods are generic.
* **Syntax:** `http.get<Type>(url)`.
* **Benefit:** TypeScript now knows the shape of the response, providing autocomplete support.
* **Code:**
```typescript
// Define the interface
export interface Post {
  title: string;
  content: string;
  id?: string;
}

// Use the generic type
this.http.get<{ [key: string]: Post }>('...url')
  .pipe(...)
  .subscribe(...);

```



### 7. Moving Logic to a Service

* **Pattern:** Components should generally not trigger HTTP requests directly. They should call a Service.
* **Implementation:**
1. Create `PostsService`.
2. Inject `HttpClient` into the Service.
3. Move `createAndStorePost` and `fetchPosts` logic into the Service.
4. **Return the Observable** from the Service methods so the Component can subscribe (and know when it's finished).


*Code (Service):*
```typescript
fetchPosts() {
  return this.http.get(...).pipe(map(...));
}

```


*Code (Component):*
```typescript
ngOnInit() {
  this.postsService.fetchPosts().subscribe(posts => {
    this.loadedPosts = posts;
    this.isFetching = false;
  });
}

```



---

### 8. Showing a Loading Indicator

* **Goal:** The user should know that data is being fetched. We don't want them staring at a blank screen.
* **Mechanism:** Use a simple boolean flag (`isFetching`) to toggle elements in the DOM.
* **Component Logic:**
1. Set `isFetching = true` immediately before sending the request.
2. Set `isFetching = false` inside the `.subscribe()` callback (both in success and error cases).


* **Template Logic:**
```html
<p *ngIf="isFetching">Loading...</p>

<ul *ngIf="!isFetching && loadedPosts.length > 0">
  <li *ngFor="let post of loadedPosts">...</li>
</ul>

```


* **Code (Component):**
```typescript
onFetchPosts() {
  this.isFetching = true; // Start loading
  this.postsService.fetchPosts().subscribe(posts => {
    this.isFetching = false; // Stop loading
    this.loadedPosts = posts;
  });
}

```



### 9. Handling Errors (The Basic Way)

* **Scenario:** The internet cuts out, or the database permission is denied. The HTTP request fails.
* **Mechanism:** The `.subscribe()` method takes a second argument: the error handler.
* **Code:**
```typescript
onFetchPosts() {
  this.postsService.fetchPosts().subscribe({
    next: (posts) => {
      // Success
    },
    error: (error) => {
      // Failure
      this.error = error.message; // Display this string in the UI
      console.log(error);
    }
  });
}

```



### 10. Using a Subject for Error Handling

* **Problem:** If you trigger a request from a Service (e.g., creating a post in the background), the Component might not be subscribed to that specific Observable. How does the Service tell the Component "Something went wrong, show an alert"?
* **Solution:** Create an `error` Subject in the Service.
* **Service Code:**
```typescript
error = new Subject<string>();

createAndStorePost(title: string, content: string) {
  this.http.post(...)
    .subscribe({
      next: data => console.log(data),
      error: error => {
        // Push the error message to anyone listening
        this.error.next(error.message);
      }
    });
}

```


* **Component Code:**
```typescript
ngOnInit() {
  this.errorSub = this.postsService.error.subscribe(errorMessage => {
    this.error = errorMessage; // Update UI
  });
}

```



### 11. Using the catchError Operator

* **Goal:** Handle the error *inside* the pipe logic (e.g., to send a log to an analytics server) before it reaches the component.
* **Operator:** `catchError` from `rxjs/operators`.
* **Requirement:** You must return an Observable (usually `throwError`) so the subscription chain continues to the error block.
* **Code:**
```typescript
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

fetchPosts() {
  return this.http.get(...)
    .pipe(
      map(...),
      catchError(errorRes => {
        // Logic: Send to analytics server...
        return throwError(() => new Error(errorRes));
      })
    );
}

```



### 12. Setting Headers

* **Goal:** You need to send custom metadata (like 'Custom-Header': 'Hello') with your request.
* **Class:** `HttpHeaders`.
* **Immutability:** Headers are immutable. You cannot do `headers.append()`. You must assign the result to a variable: `headers = headers.append()`.
* **Code:**
```typescript
import { HttpHeaders } from '@angular/common/http';

fetchPosts() {
  return this.http.get('url', {
    headers: new HttpHeaders({ 'Custom-Header': 'Hello' })
  });
}

```



### 13. Adding Query Params

* **Goal:** Change the URL dynamically (e.g., `.../posts.json?print=pretty&key=value`).
* **Class:** `HttpParams`.
* **Code:**
```typescript
import { HttpParams } from '@angular/common/http';

let searchParams = new HttpParams();
searchParams = searchParams.append('print', 'pretty');
searchParams = searchParams.append('custom', 'key');

return this.http.get('url', {
  headers: new HttpHeaders(...),
  params: searchParams // Result: url?print=pretty&custom=key
});

```



### 14. Observing Different Types of Responses

* **Problem:** By default, Angular extracts the JSON body of the response and gives you *only* that. Sometimes you need the Status Code (200, 404) or the full Headers.
* **Solution:** Set the `observe` option to `'response'`.
* **Code:**
```typescript
this.http.get('url', {
  observe: 'response' // Default is 'body'
}).subscribe(response => {
  // Now 'response' is the full HttpResponse object
  console.log(response.status); // 200
  console.log(response.body);   // The data
});

```



### 15. Changing the Response Body Type

* **Scenario:** Sometimes the server returns text, not JSON. If Angular tries to parse it as JSON, it crashes.
* **Solution:** Set the `responseType` option.
* **Options:** `'json'` (default), `'text'`, `'blob'` (files), `'arraybuffer'`.
* **Code:**
```typescript
this.http.get('url', {
  responseType: 'text'
}).subscribe(data => {
  console.log(data); // "data" is now a raw string
});

```



---
### 16. Introduction to Interceptors

* **Concept:** Often, you want to do the exact same thing for *every* outgoing HTTP request (e.g., adding an Authentication Token header) or handle *every* incoming response (e.g., logging errors globally).
* **The "Bad" Way:** Manually adding headers in every single `http.get()` call across 50 different services.
* **The "Interceptor" Way:** Define a function/class that sits in the middle.
* **Outgoing:** It intercepts the request *before* it leaves the app.
* **Incoming:** It intercepts the response *before* it reaches your service/component subscription.



### 17. Defining an Interceptor (The Class)

* **Structure:** An interceptor is a service implementing the `HttpInterceptor` interface.
* **Method:** It requires one method: `intercept(req, next)`.
* **Code (`auth-interceptor.service.ts`):**
```typescript
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export class AuthInterceptorService implements HttpInterceptor {
  // req: The outgoing request
  // next: The object that lets the request continue its journey
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Request is on its way');

    // IMPORTANT: You must call next.handle(req) or the request dies here.
    return next.handle(req); 
  }
}

```



### 18. Manipulating Request Objects

* **Constraint:** The `HttpRequest` object is **immutable**. You cannot change it directly (e.g., `req.headers.append` will fail).
* **Solution:** You must **clone** the request and modify the clone.
* **Scenario:** Add a header `Auth: xyz` to every request.
* **Code:**
```typescript
intercept(req: HttpRequest<any>, next: HttpHandler) {
  // Clone the request and overwrite/add headers
  const modifiedRequest = req.clone({
    headers: req.headers.append('Auth', 'xyz')
  });

  // Pass the MODIFIED request forward
  return next.handle(modifiedRequest);
}

```



### 19. Registering Interceptors (Legacy/Modules)

* **Goal:** Tell Angular to use this class.
* **Location:** `app.module.ts`.
* **Token:** `HTTP_INTERCEPTORS`.
* **Multi:** We must set `multi: true` so Angular knows we can have *multiple* interceptors, not just one.
* **Code:**
```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './auth-interceptor.service';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ]
})
export class AppModule {}

```



### 20. Registering Functional Interceptors (Modern/Standalone)

* **Context:** In modern Angular (15+), interceptors can be simple functions instead of classes.
* **Location:** `app.config.ts` (or `main.ts`).
* **Code:**
```typescript
// logging.interceptor.ts (The Function)
import { HttpInterceptorFn } from '@angular/common/http';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Outgoing Request:', req.url);
  return next(req);
};

// app.config.ts (The Registration)
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([loggingInterceptor]) // Register function here
    )
  ]
};

```



### 21. Response Interceptors

* **Goal:** Modify or read the response globally (e.g., logging every incoming event).
* **Mechanism:** The `next.handle(req)` method returns an Observable. We can use the `.pipe()` operator on it just like any other Observable.
* **Code:**
```typescript
import { tap } from 'rxjs/operators';
import { HttpEventType } from '@angular/common/http';

intercept(req: HttpRequest<any>, next: HttpHandler) {
  return next.handle(req).pipe(
    tap(event => {
      // Check if the event is the actual Response arrival
      if (event.type === HttpEventType.Response) {
        console.log('Incoming Response Body:', event.body);
      }
    })
  );
}

```



### 22. Multiple Interceptors & Order of Execution

* **Scenario:** You have a `LoggingInterceptor` and an `AuthInterceptor`.
* **Order:** Angular executes them in the order you provide them in the `providers` array (or `withInterceptors` array).
* **Example:**
```typescript
providers: [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },    // Runs 1st
  { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true }  // Runs 2nd
]

```


* **Implication:** If `AuthInterceptor` modifies the header, `LoggingInterceptor` (running 2nd) *will* see that new header.

---

### Section Wrap-up

You have now mastered backend communication.

* **HttpClient:** Use methods like `get<T>()` and `post()` to talk to servers.
* **Observables:** Always `.subscribe()` or the request won't send.
* **Operators:** Use `map` to fix data formats and `catchError` for global error logic.
* **Interceptors:** The clean way to attach Auth tokens or log requests globally.

---
## <a id="section-13"></a>Section 13: Handling Forms

### 1. Module Introduction & Two Approaches

* **The Challenge:** We don't just want to "get values" (which we could do with simple references). We want to check if the form is **Valid** (no errors) or **Touched** (user clicked inside).
* **Approach 1: Template-Driven (TD):**
* **Logic:** Angular infers the form structure from the HTML template.
* **Usage:** Simple, quick to set up. Heavy reliance on directives like `ngModel`.


* **Approach 2: Reactive Forms:**
* **Logic:** You define the form structure explicitly in TypeScript code.
* **Usage:** More complex setup, but finer control and easier unit testing.



### 2. Setup for Template-Driven Forms

* **Requirement:** To use TD forms, you **must** import `FormsModule` in your Module or Component imports.
* **Location:** `app.module.ts` (Legacy) or the Component's `imports: []` (Standalone).
* **Code:**
```typescript
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [FormsModule, ...]
})
export class AppModule {}

```



### 3. Creating the Form & Registering Controls

* **Automatic behavior:** When Angular sees a `<form>` tag, it automatically creates a JavaScript object representation of that form.
* **The Problem:** By default, Angular detects the `<form>`, but it does **not** automatically detect the `<input>` fields inside it. You must register them manually.
* **Step 1:** Add the `name` attribute to the input (HTML standard requirement).
* **Step 2:** Add the `ngModel` directive (Angular requirement).
* *Note: Here `ngModel` is used without `[]` or `()`. This tells Angular: "Please treat this input as a control in your form object."*



**Code:**

```html
<form>
  <label>Username</label>
  <input type="text" name="username" ngModel>
  
  <label>Email</label>
  <input type="email" name="email" ngModel>
  
  <button type="submit">Submit</button>
</form>

```

### 4. Submitting and Using the Form

* **Standard HTML:** Normally, clicking a submit button sends a request to the server and reloads the page. We want to prevent this (SPA behavior).
* **Angular Event:** Use `(ngSubmit)` on the `<form>` tag.
* **Accessing the Form:** We need access to the JavaScript object Angular created.
* We use a **Local Reference** `#f`.
* We assign it to `"ngForm"`: `#f="ngForm"`. This tells Angular to expose the internal Form Object, not just the HTML Element.



**Code:**

```html
<form (ngSubmit)="onSubmit(f)" #f="ngForm">
  ... inputs ...
  <button type="submit">Submit</button>
</form>

```

**TypeScript Logic:**

```typescript
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms'; // Import the type

@Component({ ... })
export class AppComponent {
  onSubmit(form: NgForm) {
    console.log(form);
    // You can access values here:
    console.log(form.value.username);
  }
}

```

### 5. Understanding the Form State

When you log the `form` object (of type `NgForm`) to the console, you see many properties automatically managed by Angular:

* **`value`**: An object containing the data `{ username: '...', email: '...' }`.
* **`valid`**: `true` if *all* controls are valid.
* **`touched`**: `true` if the user has clicked inside at least one field and then clicked out.
* **`dirty`**: `true` if the user has changed/typed any value.
* **`controls`**: Access to individual inputs (e.g., to check if just the 'email' is invalid).



### 6. Adding Validation

* **Concept:** Angular TD forms piggyback on standard HTML5 validation attributes. Angular detects these attributes and updates its internal `valid` / `invalid` state accordingly.
* **Common Validators:**
* `required`: Field must not be empty.
* `email`: Must be a valid email format (Angular adds a directive for this).
* `minlength="5"`: Minimum characters.
* `pattern`: Regex validation.


* **Action:** Add these attributes to your `<input>` tags.

**Code:**

```html
<input 
  type="email" 
  name="email" 
  ngModel 
  required 
  email>

```

### 7. Accessing Control State & Showing Error Messages

* **Goal:** We want to show a red border or an error text (e.g., "Email is invalid") if the user types something wrong.
* **Problem:** We need access to the *state* of that specific input (valid/invalid) inside the HTML.
* **Solution:** Use a **Local Reference** assigned to `ngModel`.
* Syntax: `#emailCtrl="ngModel"`.
* This gives you access to the Angular properties (`valid`, `touched`, `dirty`) for *that specific input*.



**Code:**

```html
<label>Email</label>
<input 
  type="email" 
  name="email" 
  ngModel 
  required 
  email
  #emailCtrl="ngModel">

<p class="help-block" *ngIf="!emailCtrl.valid && emailCtrl.touched">
  Please enter a valid email!
</p>

```

### 8. Styling Invalid Controls (CSS Classes)

* **Automatic Classes:** Angular automatically adds CSS classes to the HTML elements based on their state:
* `.ng-valid` vs `.ng-invalid`
* `.ng-touched` vs `.ng-untouched`
* `.ng-dirty` vs `.ng-pristine`


* **Usage:** You can define global styles for these classes to give visual feedback (e.g., red borders).

**CSS Code:**

```css
/* If input is invalid AND touched, make border red */
input.ng-invalid.ng-touched {
  border: 1px solid red;
}

```

### 9. Default Values & Two-Way Binding in Forms

* **Goal:** Pre-fill the form (e.g., "Default User") or react instantly to typing.
* **One-Way (Pre-fill only):** `[ngModel]="defaultValue"`. The form starts with this value, but typing doesn't change `defaultValue` in the TS file.
* **Two-Way (React instant):** `[(ngModel)]="answer"`. The form starts with value, and typing *immediately* updates the `answer` property in your class (just like standard two-way binding).

**Code:**

```html
<select name="secret" [ngModel]="'pet'">
  <option value="pet">Your first Pet?</option>
  <option value="teacher">Your first Teacher?</option>
</select>

<textarea name="questionAnswer" [(ngModel)]="answer"></textarea>
<p>Your reply: {{ answer }}</p> 

```

### 10. Grouping Form Controls (ngModelGroup)

* **Scenario:** You have a complex form with User Data (username, email) and Address Data (street, city). You want to check if just the *User Data* group is valid.
* **Directive:** `ngModelGroup`.
* **Usage:** Wrap the inputs in a `div` and apply the directive.

**Code:**

```html
<div id="user-data" ngModelGroup="userData" #userData="ngModelGroup">
  <input name="username" ngModel required>
  <input name="email" ngModel required>
</div>

<p *ngIf="!userData.valid && userData.touched">User Data is invalid!</p>

```

* *Note: The structure of `form.value` changes. It now becomes nested:*
`{ userData: { username: '...', email: '...' }, secret: '...' }`

### 11. Setting and Patching Form Values

* **Scenario:** You have a "Suggest Username" button. When clicked, it should fill the username field but *leave other fields alone*.
* **Method 1: `form.setValue()**`
* **Behavior:** It overwrites the **ENTIRE** form. If you miss a field (like email), it resets it to empty/null.
* *Usage:* Use only if setting every single field at once.


* **Method 2: `form.form.patchValue()**`
* **Behavior:** It updates **ONLY** the specific fields you provide. It leaves the others untouched.
* *Usage:* Best for "Suggest" features or partial updates.



**Code (TypeScript):**

```typescript
@ViewChild('f') signupForm: NgForm; // Access form in TS

onSuggestUserName() {
  const suggestedName = 'Superuser';

  // Approach 1: Destructive (Resets email/secret)
  /*
  this.signupForm.setValue({
    userData: {
      username: suggestedName,
      email: ''
    },
    secret: 'pet',
    questionAnswer: ''
  });
  */

  // Approach 2: Safe (Only updates username)
  this.signupForm.form.patchValue({
    userData: {
      username: suggestedName
    }
  });
}

```

### 12. Resetting the Form

* **Goal:** Clear all values and **reset the state** (turn `submitted`, `touched`, `dirty` back to false) after submission.
* **Method:** `form.reset()`.

**Code:**

```typescript
onSubmit() {
  // 1. Use the data
  console.log(this.signupForm.value);
  
  // 2. Clear form and validation state
  this.signupForm.reset();
}

```

### 13. Setup for Reactive Forms

* **Requirement:** You must switch modules.
* **Old:** `FormsModule` (for Template-Driven).
* **New:** `ReactiveFormsModule`.
* **Location:** `app.module.ts` (or Component imports).

**Code:**

```typescript
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [ReactiveFormsModule, ...]
})
export class AppModule {}

```

### 14. Creating a Form in Code

* **Concept:** Instead of Angular guessing the form structure from HTML, *we* create the object manually in `ngOnInit`.
* **Classes:**
* **`FormGroup`**: Represents the whole form (or a section of it).
* **`FormControl`**: Represents a single input (email, password).


* **Initialization:**
* Argument 1: Initial State (default value).
* Argument 2: Validators (Single or Array).
* Argument 3: Async Validators.



**Code (TypeScript):**

```typescript
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({ ... })
export class AppComponent implements OnInit {
  signupForm: FormGroup; // Declare the property

  ngOnInit() {
    // Initialize the form structure
    this.signupForm = new FormGroup({
      'username': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'gender': new FormControl('male') // Default value 'male'
    });
  }

  onSubmit() {
    // We access the form directly via 'this'
    console.log(this.signupForm.value);
  }
}

```

### 15. Syncing HTML with the TypeScript Form

* **Goal:** Tell the HTML `<form>` to listen to the `signupForm` object we just created.
* **Directives:**
* `[formGroup]`: Connects the main form tag.
* `formControlName`: Connects individual inputs (Must match the string keys used in `new FormGroup`).



**Code (HTML):**

```html
<form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
  
  <label>Username</label>
  <input type="text" formControlName="username">
  
  <label>Email</label>
  <input type="text" formControlName="email">
  
  <button type="submit">Submit</button>
</form>

```

### 16. Validation & Error Messages

* **Accessing Controls:** In TD forms, we used `#email="ngModel"`. In Reactive forms, we use `signupForm.get('controlName')`.
* **Checking Errors:** `.get('email').valid` or `.get('email').errors`.

**Code:**

```html
<input type="text" formControlName="username">

<span 
  *ngIf="!signupForm.get('username').valid && signupForm.get('username').touched"
  class="help-block">
  Please enter a valid username!
</span>

```

### 17. Grouping Controls (Nested FormGroups)

* **Goal:** Group "username" and "email" under "userData", just like we did with `ngModelGroup`.
* **TS:** Nest a `FormGroup` inside the main `FormGroup`.
* **HTML:** Use `formGroupName` directive.

**Code (TS):**

```typescript
this.signupForm = new FormGroup({
  'userData': new FormGroup({ // Nested Group
    'username': new FormControl(null, Validators.required),
    'email': new FormControl(null, [Validators.required, Validators.email])
  }),
  'gender': new FormControl('male')
});

```

**Code (HTML):**

```html
<form [formGroup]="signupForm" ...>
  <div formGroupName="userData"> <input formControlName="username">
    <input formControlName="email">
  </div>
  ...
</form>

```

### 18. Arrays of Controls (FormArray)

* **Feature:** **Dynamic Controls**. This is where Reactive Forms shine. Imagine a button "Add Hobby" that adds a new input field every time it's clicked.
* **Class:** `FormArray`. It holds a list of Controls.

**Step 1: Define Array in TS**

```typescript
import { FormArray } from '@angular/forms';

this.signupForm = new FormGroup({
  // Initialize empty array
  'hobbies': new FormArray([]) 
});

```

**Step 2: Add Control Method**

```typescript
onAddHobby() {
  const control = new FormControl(null, Validators.required);
  // Cast to FormArray to treat it as an array
  (<FormArray>this.signupForm.get('hobbies')).push(control);
}

```

**Step 3: Sync HTML (Looping)**

* **Note:** We loop over `controls` inside the FormArray.
* **Access:** `formArrayName="hobbies"` on the wrapper. `[formControlName]="i"` on the input (using index).

```html
<div formArrayName="hobbies">
  <h4>Your Hobbies</h4>
  <button type="button" (click)="onAddHobby()">Add Hobby</button>
  
  <div *ngFor="let hobbyControl of getControls(); let i = index">
    <input type="text" [formControlName]="i">
  </div>
</div>

```

**Step 4: Helper Getter (Required for Modern Angular strict mode)**
Trying to loop directly over `signupForm.get('hobbies').controls` in the HTML often causes type errors. It's best to create a getter.

```typescript
getControls() {
  return (<FormArray>this.signupForm.get('hobbies')).controls;
}

```


### 19. Creating Custom Validators

* **Goal:** The built-in validators (`required`, `email`) aren't enough. We want to forbid specific usernames (e.g., 'Chris', 'Anna').
* **Concept:** A validator is just a function. It receives a `FormControl` and returns either `null` (if valid) or an object `{ errorName: true }` (if invalid).
* **Implementation:**
1. Define the forbidden names array.
2. Write the function.
3. Add it to the `Validators` array in the `FormControl` definition.



**Code (TypeScript):**

```typescript
// Define forbidden names
forbiddenUsernames = ['Chris', 'Anna'];

// The Validator Function
forbiddenNames(control: FormControl): {[s: string]: boolean} {
  // Check if value is in our forbidden array
  if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
    // Return error object (INVALID)
    return {'nameIsForbidden': true};
  }
  // Return null (VALID) - Do NOT return false
  return null;
}

```

**Usage in OnInit:**

* **Note:** We must use `.bind(this)` because inside the validator, `this` refers to the control, not the component class (so `this.forbiddenUsernames` would be undefined without binding).

```typescript
this.signupForm = new FormGroup({
  'username': new FormControl(null, [
    Validators.required, 
    this.forbiddenNames.bind(this) // Bind 'this' context
  ]),
  // ...
});

```

### 20. Using Error Codes in HTML

* **Goal:** Show a specific message if the error is "nameIsForbidden".
* **Access:** The object returned by the validator (`{'nameIsForbidden': true}`) is stored in `control.errors`.

**Code (HTML):**

```html
<span *ngIf="signupForm.get('username').hasError('nameIsForbidden')">
  This name is forbidden!
</span>
<span *ngIf="signupForm.get('username').hasError('required')">
  Name is required!
</span>

```

### 21. Creating Async Validators

* **Scenario:** You want to check if an email is already taken. You can't know this instantly; you have to send an HTTP request to a server and wait 2 seconds.
* **Concept:** An Async Validator returns a `Promise` or an `Observable` instead of a plain object. Angular waits for it to resolve before marking the field as valid/invalid.
* **Status:** While waiting, the form status is `'PENDING'`.

**Code (TypeScript):**

```typescript
import { Observable } from 'rxjs';

forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
  const promise = new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      if (control.value === 'test@test.com') {
        // Resolve with error object
        resolve({'emailIsForbidden': true});
      } else {
        // Resolve with null
        resolve(null);
      }
    }, 1500); // Simulate 1.5s server delay
  });
  return promise;
}

```

**Usage in OnInit:**

* **Argument 3:** Async validators go in the **third argument** of the `FormControl` constructor.

```typescript
this.signupForm = new FormGroup({
  'email': new FormControl(
    null, 
    [Validators.required, Validators.email], // Arg 2: Sync Validators
    this.forbiddenEmails // Arg 3: Async Validators
  )
});

```

### 22. Reacting to Status & Value Changes

* **Goal:** You want to run code immediately whenever the user types something (e.g., auto-save draft) or when the form status changes from INVALID to VALID.
* **Observables:** Every form control (and the group itself) exposes two Observables:
1. `valueChanges`: Emits the value on every keystroke.
2. `statusChanges`: Emits 'VALID', 'INVALID', or 'PENDING'.



**Code (ngOnInit):**

```typescript
// Log every keystroke in the form
this.signupForm.valueChanges.subscribe(
  (value) => console.log(value)
);

// React to status updates
this.signupForm.statusChanges.subscribe(
  (status) => console.log(status)
);

```

### 23. Setting & Patching Values (Reactive)

* **Concept:** Just like Template-Driven forms, we have `setValue` (update all) and `patchValue` (update some).
* **Difference:** We call these methods directly on the `FormGroup` property.

**Code:**

```typescript
// Update specific field
this.signupForm.patchValue({
  'userData': {
    'username': 'Anna'
  }
});

// Reset Form
this.signupForm.reset();

```

---

### Section Wrap-up

You have now mastered Forms in Angular.

* **Template-Driven:** Great for simple forms. Logic in HTML (`ngModel`).
* **Reactive:** Great for complex, dynamic forms. Logic in TS (`new FormGroup`).
* **Validation:** Use standard validators (`required`), Custom functions (sync), or Async functions (server checks).

---
## <a id="section-14"></a>Section 14: Routing & Navigation

### 1. Module Introduction & Setup

* **Goal:** Turn the application into a Single Page Application (SPA). Instead of reloading the page to show a new view, Angular swaps the components in and out.
* **Setup:** You need the `Router` setup in your main configuration.
* **Code (app.routes.ts):** defines the map between URL paths and Components.
```typescript
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // localhost:4200/
  { path: 'users', component: UsersComponent } // localhost:4200/users
];

```


* **Code (app.config.ts / main.ts):**
```typescript
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});

```



### 2. The `<router-outlet>`

* **Concept:** This is a placeholder directive. It marks the spot in your HTML where Angular should insert the component matching the current URL.
* **Usage:** Usually found in `app.component.html`.
```html
<app-header></app-header>
<router-outlet></router-outlet>
<app-footer></app-footer>

```



### 3. Navigation with `routerLink`

* **Problem:** If you use standard HTML `<a href="/users">`, the browser will reload the entire app.
* **Solution:** Use the `routerLink` directive. It tells Angular to intercept the click and update the URL internally.
* **Code:**
```html
<a routerLink="/users">Users</a>

<a [routerLink]="['/users', userId]">User Profile</a>

```



### 4. Styling Active Links (`routerLinkActive`)

* **Goal:** Highlight the menu item corresponding to the current page.
* **Directive:** `routerLinkActive="className"`.
* **Configuration:** By default, it matches partially (e.g., `/users` also matches `/users/10`). Use `[routerLinkActiveOptions]="{exact: true}"` for exact matching (essential for the Home `/` link).
* **Code:**
```html
<li routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
  <a routerLink="/">Home</a>
</li>
<li routerLinkActive="active-link">
  <a routerLink="/users">Users</a>
</li>

```



### 5. Relative vs. Absolute Paths

* **Absolute (`/server`):** Always starts from the root domain.
* **Relative (`server` or `./server`):** Appends to the *current* URL.
* *Example:* If you are at `/users` and click a link to `details` (relative), you go to `/users/details`.
* *Config:* To navigate relatively inside a component function, you need `ActivatedRoute`.


```typescript
constructor(private router: Router, private route: ActivatedRoute) {}

onReload() {
  // Goes to /current-path/servers
  this.router.navigate(['servers'], { relativeTo: this.route });
}

```



### 6. Passing Dynamic Parameters (Path Params)

* **Goal:** Load a specific user, e.g., `/users/5`.
* **Route Definition:** Use a colon `:`.
```typescript
{ path: 'users/:id', component: UserComponent }

```


* **Fetching the Parameter (Snapshot):**
```typescript
// Only works if you land on the page once and don't change params while staying on same component
const id = this.route.snapshot.params['id'];

```


* **Fetching the Parameter (Observable):**
* *Best Practice:* If you are on `/users/5` and click a link to `/users/10`, the component is *not* destroyed and recreated. The snapshot won't change. You MUST subscribe.


```typescript
this.route.params.subscribe(params => {
  this.id = params['id']; // Updates whenever URL changes
});

```



### 7. Passing Query Parameters & Fragments

* **Goal:** Optional data like `/servers?mode=edit#loading`.
* **Passing them (HTML):**
```html
<a [routerLink]="['/servers']" 
   [queryParams]="{mode: 'edit'}" 
   fragment="loading">
   Edit Server
</a>

```


* **Passing them (Code):**
```typescript
this.router.navigate(['/servers'], {
  queryParams: { mode: 'edit' },
  fragment: 'loading'
});

```


* **Retrieving them:**
```typescript
// Snapshot
this.mode = this.route.snapshot.queryParams['mode'];
this.fragment = this.route.snapshot.fragment;

// Observable (Reactive)
this.route.queryParams.subscribe(params => { ... });
this.route.fragment.subscribe(frag => { ... });

```

### 8. Nested Routes (Child Routes)

* **Scenario:** You have a `ServersComponent` (`/servers`). Inside this page, you have a list of servers on the left. When you click one, you want to display the details *on the right side of the same page*, not on a completely new blank page.
* **Concept:** Routes can have **children**.
* **Step 1: Configuration (`app.routes.ts`):**
Use the `children` array inside a route definition.
```typescript
const routes: Routes = [
  { 
    path: 'servers', 
    component: ServersComponent, 
    children: [
      // Matches /servers/ (default text)
      { path: '', component: ServerStartComponent }, 
      // Matches /servers/:id (details)
      { path: ':id', component: ServerDetailComponent }, 
      // Matches /servers/:id/edit (edit mode)
      { path: ':id/edit', component: EditServerComponent } 
    ]
  }
];

```


* **Step 2: The Second `<router-outlet>`:**
Since these are *child* routes, they will NOT load in the main `app.component.html` outlet. They load inside the **Parent Component** (`servers.component.html`).
**Code (`servers.component.html`):**
```html
<div class="row">
  <div class="col-xs-12 col-sm-4">
    <app-list-servers></app-list-servers>
  </div>
  <div class="col-xs-12 col-sm-4">
    <router-outlet></router-outlet>
  </div>
</div>

```



### 9. Redirecting and Wildcard Routes (404 Page)

* **Scenario:** If a user types a URL that doesn't exist (`/nothing`), the app crashes or shows a blank screen. We want to show a "Page Not Found" component or redirect them home.
* **Wildcard (`**`):** This path matches **anything** that hasn't been matched by previous routes.
* **Important:** Order matters! The wildcard route **must be the last one** in your array. If it's at the top, it will match `/users` (because `/users` matches "anything") and break your app.

**Code:**

```typescript
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', component: UsersComponent },
  
  // 1. Specific Page Not Found Component
  { path: 'not-found', component: PageNotFoundComponent },
  
  // 2. Redirect /something-weird to /not-found
  { path: '**', redirectTo: '/not-found' } 
];

```

### 10. Path Matching Strategies (full vs prefix)

* **Scenario:** You have a redirect for the empty path `''`.
```typescript
{ path: '', redirectTo: '/home' } // ERROR (Infinite Loop potential)

```


* **Reason:** By default, Angular matches routes by **prefix**. Every URL *starts* with an empty string. So the empty path matches everything.
* **Fix:** Use `pathMatch: 'full'`. This tells Angular: "Only redirect if the *entire* URL is empty."

**Code:**

```typescript
{ path: '', redirectTo: '/home', pathMatch: 'full' }

```

### 11. Preserving Query Parameters

* **Scenario:** You are on `/servers?mode=edit`. You click a link to "Reload" or navigate deeper. By default, Angular **clears** query parameters on navigation. You end up at `/servers` (edit mode lost).
* **Solution:** Use the `queryParamsHandling` option in the `Maps` method or `routerLink`.
* **Options:**
* `'preserve'`: Keep the current parameters exactly as they are.
* `'merge'`: Add new parameters to the existing ones.



**Code (TypeScript):**

```typescript
constructor(private router: Router, private route: ActivatedRoute) {}

onEdit() {
  // Navigate to 'edit' child route
  this.router.navigate(['edit'], { 
    relativeTo: this.route, 
    // KEEP the ?mode=edit param
    queryParamsHandling: 'preserve' 
  });
}

```

**Code (HTML):**

```html
<a 
  routerLink="edit" 
  queryParamsHandling="preserve">
  Edit
</a>

```


### 12. Protecting Routes with Guards (CanActivate)

* **Goal:** Prevent users from visiting `/servers` unless they are logged in.
* **Concept:** A Guard is a script that runs *before* the router loads a route. It returns `true` (allow) or `false` (block/redirect).
* **Modern Approach (Functional Guards):** Angular 15+ uses simple functions instead of classes.

**Step 1: Define the Guard Function (`auth.guard.ts`)**

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; // Allow navigation
  } else {
    // Optional: Redirect them to a login page
    return router.createUrlTree(['/']); 
  }
};

```

**Step 2: Apply to Routes (`app.routes.ts`)**

```typescript
{ 
  path: 'servers', 
  component: ServersComponent,
  canActivate: [authGuard] // Attach the guard here
}

```

### 13. Protecting Child Routes (CanActivateChild)

* **Scenario:** You want everyone to see the main `/servers` list, but only admins can click into details `/servers/1`.
* **Type:** `CanActivateChildFn`.
* **Usage:** You can create a specific guard for children, or reuse the same logic.

**Code (`app.routes.ts`):**

```typescript
{ 
  path: 'servers', 
  component: ServersComponent,
  // This guard runs for ANY child route, but not the parent itself
  canActivateChild: [authGuard], 
  children: [ ... ]
}

```

### 14. controlling Navigation *Away* (CanDeactivate)

* **Goal:** If a user is filling out a form on `/servers/1/edit` and tries to leave without saving, show a "Do you really want to leave?" confirmation.
* **Challenge:** The Guard is a generic file, but the *state* (whether the form is dirty) is inside the *Component*.
* **Solution:** Use an **Interface**. The Component implements the interface, and the Guard calls a method defined by that interface.

**Step 1: Define Interface (`can-deactivate.guard.ts`)**

```typescript
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

```

**Step 2: Create the Guard**

```typescript
import { CanDeactivateFn } from '@angular/router';

export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = 
  (component, currentRoute, currentState, nextState) => {
    // Call the method ON the component
    return component.canDeactivate();
  };

```

**Step 3: Implement in Component**

```typescript
export class EditServerComponent implements CanComponentDeactivate {
  changesSaved = false;

  canDeactivate(): boolean {
    if (!this.changesSaved) {
      return confirm('Do you want to discard your changes?');
    }
    return true;
  }
}

```

**Step 4: Register in Routes**

```typescript
{ 
  path: ':id/edit', 
  component: EditServerComponent, 
  canDeactivate: [canDeactivateGuard] 
}

```

### 15. Passing Static Data to a Route

* **Scenario:** You reuse the `ErrorPageComponent` for different errors.
* URL `/not-found` -> Should say "Page not found!"
* URL `/server-error` -> Should say "Server is down!"


* **Feature:** The `data` property in the route configuration.

**Config:**

```typescript
{ path: 'not-found', component: ErrorPageComponent, data: {message: 'Page not found!'} },
{ path: 'server-error', component: ErrorPageComponent, data: {message: 'Server is down!'} }

```

**Component Access:**

```typescript
ngOnInit() {
  // Access the static data via snapshot or observable
  this.errorMessage = this.route.snapshot.data['message'];
  
  this.route.data.subscribe(data => {
    this.errorMessage = data['message'];
  });
}

```

### 16. Resolving Dynamic Data (Resolvers)

* **Problem:** If you navigate to `/servers/1`, the component loads immediately. Then, inside `ngOnInit`, you fetch the server data. This causes the UI to "pop" or show empty fields for a split second.
* **Solution:** Use a **Resolver**. It fetches the data *before* the route is activated. The component only loads once the data is ready.

**Step 1: Create Resolver Function (`server-resolver.ts`)**

```typescript
import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { ServersService } from './servers.service';

interface Server { id: number; name: string; status: string; }

export const serverResolver: ResolveFn<Server> = (route, state) => {
  const serversService = inject(ServersService);
  // Return the data (Observable, Promise, or value)
  // Angular waits for this to complete
  return serversService.getServer(+route.params['id']);
};

```

**Step 2: Register in Route**

```typescript
{ 
  path: 'servers/:id', 
  component: ServerComponent, 
  // Map the result to a key named 'server'
  resolve: { server: serverResolver } 
}

```

**Step 3: Access in Component**

* **Note:** The component no longer needs to fetch the data itself. It just reads it from the route.

```typescript
ngOnInit() {
  this.route.data.subscribe((data) => {
    // 'server' matches the key used in the 'resolve' object above
    this.server = data['server']; 
  });
}

```

### 17. Hash Location Strategy (Optional)

* **Context:** By default, Angular uses "Path Location" (`localhost:4200/users`).
* **Issue:** In older server configurations (like plain Apache/IIS), reloading `/users` might return a 404 error because the server looks for a real file named "users".
* **Fix:** Use Hash Location (`localhost:4200/#/users`). The part after the `#` is ignored by the server and handled only by Angular.
* **Code (`app.config.ts`):**
```typescript
import { provideRouter, withHashLocation } from '@angular/router';

providers: [
  provideRouter(routes, withHashLocation())
]

```



---

### Section Wrap-up

You have now mastered the Angular Router.

* **Config:** `Routes` array defining path/component pairs.
* **Navigation:** `routerLink` for template, `router.navigate` for code.
* **Params:** Access via `ActivatedRoute` (snapshot or params observable).
* **Guards:** `CanActivate` to protect, `CanDeactivate` to confirm leaving.
* **Resolvers:** Fetch data *before* rendering.

---

## <a id="section-15"></a>Section 15: Code Splitting & Deferrable Views

### 1. Module Introduction & Why Code Splitting?

* **The Problem:** By default, Angular bundles **all** your code (Home, Users, Admin, Settings) into one giant JavaScript file (`main.js`).
* **The Consequence:** When a user visits just the "Home" page, they still have to download the code for "Admin" and "Settings". This makes the initial load slow (`LCP` - Largest Contentful Paint).
* **The Solution (Code Splitting):** Angular splits your app into smaller "chunks". The "Admin" chunk is only downloaded when the user actually clicks the "Admin" link. This is called **Lazy Loading**.

### 2. Lazy Loading Routes (The Modern Way)

* **Context:** In the past, we used `loadChildren` pointing to a string path. In Modern Angular (Standalone), we use `loadComponent`.
* **Implementation:** In your `app.routes.ts`, instead of importing the component component at the top of the file, you use a dynamic import function inside the route definition.

**Code (`app.routes.ts`):**

```typescript
import { Routes } from '@angular/router';
// Note: We do NOT import UsersComponent here at the top!

export const routes: Routes = [
  {
    path: '',
    // Eagerly loaded (downloaded immediately)
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'users',
    // LAZY Loaded: Downloaded only when user visits /users
    loadComponent: () => import('./users/users.component').then(m => m.UsersComponent)
  }
];

```

* **Result:** When you build the app, you will see extra files generated (e.g., `chunk-7A2B.js`). These are the lazy chunks.

### 3. Introduction to Deferrable Views (@defer)

* **Context:** Lazy Loading Routes is great for whole pages. But what if you have a heavy component (e.g., a complex Chart or Map) *inside* a page that you want to delay loading?
* **Feature:** Angular 17 introduced the **`@defer`** block.
* **Behavior:** Content inside `@defer` is **lazy-loaded** automatically. Angular splits the code for components inside this block into a separate chunk and loads it only when the trigger condition is met.

### 4. Basic Syntax & Triggers

* **Syntax:** Wrap the component in `@defer`.
* **Default Trigger:** If you don't specify a trigger, it loads when the browser is "idle" (Idle Detection).

**Code:**

```html
@defer {
  <app-heavy-chart></app-heavy-chart>
}

```

### 5. Using Interaction Triggers (`on interaction`)

* **Goal:** Load the component only when the user clicks or interacts with a specific element.
* **Syntax:** `@defer (on interaction)`.
* **Implicit:** If no element is specified, it waits for interaction with the `@placeholder`.
* **Explicit:** You can target a button using a local reference (`#trigger`).

**Code:**

```html
<button type="button" #loadBtn>Load Chart</button>

@defer (on interaction(loadBtn)) {
  <app-heavy-chart></app-heavy-chart>
}

```

### 6. Using Viewport Triggers (`on viewport`)

* **Goal:** Load the component only when the user scrolls down and the element comes into view (Lazy Scrolling).
* **Syntax:** `@defer (on viewport)`.

**Code:**

```html
<div style="height: 2000px">Long content...</div>

@defer (on viewport) {
  <app-heavy-map></app-heavy-map>
} @placeholder {
  <p>Scroll down to see the map...</p>
}

```

### 7. Managing States: @placeholder, @loading, @error

Since the content is loaded asynchronously, you need to handle the different states of the UI.

1. **`@placeholder`**:
* Shown **before** loading starts.
* **Crucial:** It reserves space in the DOM so the layout doesn't "jump" (Cumulative Layout Shift - CLS) when the content finally loads.
* *Option:* `minimum 1s` (Shows for at least 1s to prevent flickering).


2. **`@loading`**:
* Shown **while** the chunk is being downloaded from the network.
* *Option:* `after 100ms; minimum 1s` (Only show if loading takes longer than 100ms, and keep showing for 1s).


3. **`@error`**:
* Shown if the network request fails.



**Full Code Example:**

```html
@defer (on interaction) {
  <app-heavy-chart></app-heavy-chart>
} 
@loading (after 100ms; minimum 1s) {
  <div class="spinner">Downloading Chart...</div>
} 
@placeholder (minimum 500ms) {
  <button>Click to Load Chart</button>
} 
@error {
  <p>Failed to load the chart. Check internet connection.</p>
}

```

### 8. Other Triggers

* `on hover`: When mouse hovers over the placeholder/trigger.
* `on immediate`: Loads as soon as it can (non-blocking).
* `on timer(5s)`: Loads after a fixed delay.
* `when condition`: Loads when a logical expression (variable) becomes true.

---

**Section Wrap-up:**
You now have the tools to make your app highly performant.

* **Routing:** Use `loadComponent` to split pages.
* **Templates:** Use `@defer` to split heavy widgets inside a page.

---
## <a id="section-16"></a>Section 16: Authentication

### 1. How SPA Authentication Works

* **Traditional Web:** The server creates a session and sends a cookie.
* **SPA (Angular):**
1. Client sends email/password to Server.
2. Server verifies credentials and returns a **Token** (a long encrypted string).
3. Client stores this token (e.g., in browser storage).
4. For future requests (e.g., "Get Recipes"), the Client attaches this token to the request. The Server validates the token to grant access.



### 2. Setting up the Auth Component & Form

* **Goal:** Create a page that handles both Login and Signup.
* **Form:** We use a simple **Template-Driven Form** with email and password fields.
* **Switch Mode:** A button to toggle between "Login Mode" and "Signup Mode".

**Code (auth.component.html):**

```html
<form #authForm="ngForm" (ngSubmit)="onSubmit(authForm)">
  <div>
    <label>E-Mail</label>
    <input type="email" name="email" ngModel required email>
  </div>
  <div>
    <label>Password</label>
    <input type="password" name="password" ngModel required minlength="6">
  </div>
  
  <div>
    <button type="submit" [disabled]="!authForm.valid">
      {{ isLoginMode ? 'Login' : 'Sign Up' }}
    </button>
    
    <button type="button" (click)="onSwitchMode()">
      Switch to {{ isLoginMode ? 'Sign Up' : 'Login' }}
    </button>
  </div>
</form>

```

**Code (auth.component.ts):**

```typescript
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({ ... })
export class AuthComponent {
  isLoginMode = true;

  constructor(private authService: AuthService) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;
    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode) {
      // Login Logic
      this.authService.login(email, password).subscribe(...);
    } else {
      // Signup Logic
      this.authService.signup(email, password).subscribe(...);
    }
    
    form.reset();
  }
}

```

### 3. Creating the AuthService

* **Goal:** Centralize all HTTP calls related to authentication.
* **API:** We use the **Firebase Auth REST API**. (Endpoints differ for Signup vs Login).
* **Response Interface:** We define an interface for what Firebase returns (mainly `idToken`, `email`, `expiresIn`).

**Code (auth.service.ts):**

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Define the shape of the API response
interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Use your actual Firebase API Key here
  private apiKey = 'YOUR_API_KEY'; 

  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    );
  }
}

```

### 4. Handling Loading States & Errors

* **Goal:** Show a spinner while waiting, and show specific error messages (e.g., "EMAIL_EXISTS") if it fails.
* **Logic:**
1. In `AuthComponent`, set `isLoading = true` before the request.
2. In `AuthComponent`, `subscribe` to the Observable returned by `AuthService`.
3. In `subscribe`, handle `next` (success) and `error` (fail).



**Code (Handling Error in Component):**

```typescript
onSubmit(form: NgForm) {
  this.isLoading = true;
  
  let authObs: Observable<AuthResponseData>; // Store the generic observable

  if (this.isLoginMode) {
    authObs = this.authService.login(...);
  } else {
    authObs = this.authService.signup(...);
  }

  authObs.subscribe({
    next: resData => {
      console.log(resData);
      this.isLoading = false;
      this.router.navigate(['/recipes']); // Redirect on success
    },
    error: errorMessage => {
      console.log(errorMessage);
      this.error = errorMessage; // Show in UI
      this.isLoading = false;
    }
  });
}

```


### 5. Creating the User Model

* **Goal:** Create a robust class to hold user data. It shouldn't just be a plain object; it should have logic to check if the token is still valid.
* **Token Logic:** We store the token expiration *date*. If the current date is *after* the expiration date, the token is invalid (null).
* **Code (`user.model.ts`):**
```typescript
export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  // Getter allows us to access it like a property: user.token
  get token() {
    // Check if token exists and hasn't expired
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}

```



### 6. Managing State with BehaviorSubject

* **Goal:** The `HeaderComponent` (showing "Logout" button) needs to know if we are logged in. The `AuthGuard` needs to know too.
* **Tool:** `BehaviorSubject` (from RxJS). Unlike a regular Subject, it holds the *current value*. When a new component subscribes, it gets the latest user data immediately.
* **Code (`auth.service.ts`):**
```typescript
import { BehaviorSubject } from 'rxjs';
import { User } from './user.model';

export class AuthService {
  // Initially null (no user logged in)
  user = new BehaviorSubject<User>(null); 

  // ...rest of code
}

```



### 7. Saving the User (On Success)

* **Action:** When the `signup` or `login` request returns successfully, we must create a `User` object and push it to the `BehaviorSubject`.
* **Private Method:** It's good practice to create a private helper method inside `AuthService` to handle this.
* **Code (`auth.service.ts`):**
```typescript
import { tap } from 'rxjs/operators';

login(email: string, password: string) {
  return this.http.post<AuthResponseData>(...).pipe(
    // Use 'tap' to perform side-effects without altering the response
    tap(resData => {
      this.handleAuthentication(
        resData.email, 
        resData.localId, 
        resData.idToken, 
        +resData.expiresIn // Convert string to number
      );
    })
  );
}

private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
  // Calculate exact expiration date (e.g., Current Time + 3600 seconds)
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

  // Create User instance
  const user = new User(email, userId, token, expirationDate);

  // Emit the user to all subscribers
  this.user.next(user);
}

```



### 8. Persisting Login (localStorage)

* **Problem:** If the user hits "Refresh" (F5), the Angular app restarts. The `AuthService` memory is wiped, `user` becomes `null`, and the user is logged out.
* **Solution:** Store the user data in the browser's `localStorage` (which survives refreshes).
* **Step A: Saving (`auth.service.ts`):**
Inside `handleAuthentication`, add:
```typescript
localStorage.setItem('userData', JSON.stringify(user));

```


* **Step B: Restoring (`autoLogin` method):**
Create a method to check storage when the app launches.
```typescript
autoLogin() {
  const userData: {
    email: string;
    id: string;
    _token: string;
    _tokenExpirationDate: string;
  } = JSON.parse(localStorage.getItem('userData'));

  if (!userData) {
    return;
  }

  const loadedUser = new User(
    userData.email,
    userData.id,
    userData._token,
    new Date(userData._tokenExpirationDate) // Convert string back to Date object
  );

  // Check if valid using the getter
  if (loadedUser.token) {
    this.user.next(loadedUser); // Restore state

    // Optional: Setup auto-logout timer based on remaining time
    const expirationDuration = 
      new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
    this.autoLogout(expirationDuration); 
  }
}

```


* **Usage:** Call `authService.autoLogin()` inside `AppComponent`'s `ngOnInit`.

### 9. Adding the Logout Feature

* **Logic:**
1. Push `null` to the user subject.
2. Remove data from `localStorage`.
3. Redirect to `/auth`.
4. Clear any auto-logout timers.


* **Code:**
```typescript
logout() {
  this.user.next(null);
  this.router.navigate(['/auth']);
  localStorage.removeItem('userData');

  if (this.tokenExpirationTimer) {
    clearTimeout(this.tokenExpirationTimer);
  }
  this.tokenExpirationTimer = null;
}

```



### 10. Auto-Logout (Timer)

* **Goal:** Automatically log the user out when the token expires (e.g., after 1 hour) for security.
* **Implementation:** Use `setTimeout`.
* **Code:**
```typescript
private tokenExpirationTimer: any;

autoLogout(expirationDuration: number) {
  this.tokenExpirationTimer = setTimeout(() => {
    this.logout();
  }, expirationDuration);
}

```

### 11. Attaching the Token via Interceptor

* **Problem:** Every time we fetch data (e.g., `fetchRecipes`), Firebase requires the token: `.../recipes.json?auth=TOKEN`. Manually adding this to every request is tedious.
* **Solution:** Use an **HttpInterceptor**.
* **Logic:**
1. Get the `user` from `AuthService`.
2. Extract the `token`.
3. Clone the request and add the `auth` query parameter.


* **Challenge:** `this.authService.user` is an Observable. We need to get the *current* value once, not subscribe indefinitely.
* **RxJS Magic:** We use `take(1)` (get one value and unsubscribe) and `exhaustMap` (wait for the user, then switch to the HTTP request).

**Code (`auth-interceptor.service.ts`):**

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1), // Get user once and unsubscribe automatically
      exhaustMap(user => {
        // If no user (e.g., during login), send original request
        if (!user) {
          return next.handle(req);
        }
        
        // If user exists, clone request and add token param
        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', user.token)
        });
        return next.handle(modifiedReq);
      })
    );
  }
}

```

### 12. Protecting Routes (AuthGuard)

* **Goal:** If a user tries to type `/recipes` in the URL bar without logging in, they should be redirected to `/auth`.
* **Logic:** Check `authService.user`. If it exists (is not null), return `true`. If not, redirect.
* **RxJS Map:** We transform the `User` object into a `boolean` (true/false) using `map`.

**Code (`auth.guard.ts`):**

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.user.pipe(
      take(1), // Important: prevent ongoing subscription bugs
      map(user => {
        const isAuth = !!user; // Convert Object to Boolean (hack)
        if (isAuth) {
          return true;
        }
        // Redirect to Auth page if not logged in
        return this.router.createUrlTree(['/auth']);
      })
    );
  }
}

```

**Usage (`app-routing.module.ts`):**

```typescript
{ 
  path: 'recipes', 
  component: RecipesComponent, 
  canActivate: [AuthGuard] // Attach guard here
}

```

### 13. Reflecting Auth State in the UI

* **Goal:** The Header should show "Logout" when logged in, and "Authenticate" when logged out.
* **Implementation:** Subscribe to the `user` Subject in the Header component.

**Code (`header.component.ts`):**

```typescript
isAuthenticated = false;
private userSub: Subscription;

constructor(private authService: AuthService) {}

ngOnInit() {
  this.userSub = this.authService.user.subscribe(user => {
    // !!user is a JS trick: null -> false, object -> true
    this.isAuthenticated = !!user;
  });
}

onLogout() {
  this.authService.logout();
}

ngOnDestroy() {
  this.userSub.unsubscribe();
}

```

**Template (`header.component.html`):**

```html
<ul class="nav navbar-nav navbar-right">
  <li *ngIf="!isAuthenticated">
    <a routerLink="/auth">Authenticate</a>
  </li>
  
  <li *ngIf="isAuthenticated">
    <a style="cursor: pointer;" (click)="onLogout()">Logout</a>
  </li>
</ul>

```

### 14. Section Wrap-up

You have built a complete Authentication system.

* **AuthService:** Handles Login/Signup API calls and stores state (`BehaviorSubject`).
* **Persistence:** `localStorage` keeps the user logged in on refresh.
* **Auto-Logout:** `setTimeout` automatically logs out when the token expires.
* **Interceptor:** `exhaustMap` attaches the token to outgoing requests seamlessly.
* **Guards:** `CanActivate` protects sensitive routes.

---
