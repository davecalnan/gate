# @davekit/gate

> Easily conditionally render UI based on user privileges.

## The Problem

Often in my apps I find myself writing code just like this:

```jsx
const Example = () => {
  const { permissions } = useAuth();

  const canViewPosts = permissions.includes("view posts");
  const canCreatePosts = permissions.includes("create posts");
  const canEditPosts = permissions.includes("edit posts");

  // 1️⃣
  if (!canViewPosts) {
    return <p>You can't view posts.</p>;
  }

  return (
    <div>
      <h1>Posts</h1>
      {/* 2️⃣ */}
      {canCreatePosts && <button>Add Post</button>}
      <div>
        <header>
          <h2>Post #1</h2>
          {/* 3️⃣ */}
          {canEditPosts && <button>Edit Post</button>}
        </header>
      </div>
    </div>
  );
};
```

So I created a `Gate` compontent to abstract this pattern and let me write my code in a way I prefer:

```jsx
const Example = () => {
  return (
    /* 1️⃣ */
    <Gate ability="view posts" fallback={<p>You can't view posts.</p>}>
      <div>
        <h1>Posts</h1>
        {/* 2️⃣ */}
        <Gate ability="create posts">
          <button>Add Post</button>
        </Gate>
        <div>
          <header>
            <h2>Post #1</h2>
            {/* 3️⃣ */}
            <Gate ability="edit posts">
              {<button>Edit Post</button>}
            </Gate>
          </header>
        </div>
      </div>
    </Gate>
  );
};
```

Admittedly it may look like a minor difference but I like that I can write my privilege checks directly in my markup without having to call any hooks or add variables to the body of the function. It's kind of like TailwindCSS, I feel a productivity benefit from being able to stay in my markup and write more declarative code.

## Installation

```sh
yarn add @davekit/gate
# or
npm install @davekit/gate
```

## Usage

Step 1: Wrap your app in a `<GateProvider />`:

```jsx
const App = () => {
  // 👇🏻 Get these abilities/permissions from your backend or wherever you define them.
  const authenticatedUsersAbilities = [
    "view posts",
    "create posts",
    "edit posts",
  ];

  return (
    <GateProvider abilities={authenticatedUsersAbilities}>
      {/* The rest of your app goes here. */}
    </GateProvider>
  );
};
```

Step 2: Use the `<Gate />` component or `useGate` hook to perform authorisation checks:

Note: These can only be used within a `<GateProvider />`, otherwise they won't know if the user can perform the ability or not.

```jsx
const ComponentExample = () => {
  return (
    <div>
      <h3>User: Michael Scott</h3>
      <Gate ability="delete users">
        <button>Delete</button>
      </Gate>
    </div>
  );
};

const HookExample = () => {
  const options = [
    useGate("edit users") && "Edit",
    useGate("delete users") && "Delete",
    useGate("reset passwords") && "Reset Password",
  ].filter(Boolean);

  return (
    <div>
      <h2>User Settings</h2>
      <select aria-label="Perform an action on this user">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
```

### Checking multiple abilities

So far we have just been checking for a single ability, both the `<Gate />` component and `useGate` hook allow checking if the user has **any** of an array of abilities or **all** of an array of abilities.

In this example, the user must have **any** (i.e at least one) of the abilities listed.

```jsx
const AnyAbility = () => {
  const canViewPatients = useGate({
    any: ["patients.all.read", "patients.assigned.read"],
  });

  if (!canViewPatients) {
    return <p>You can't view patients.</p>;
  }

  return (
    <div>
      <h1>Patients</h1>
      <Gate
        ability={{ any: ["patients.all.write", "patients.assigned.write"] }}
      >
        <button>Add Patient</button>
      </Gate>
    </div>
  );
};
```

In this example the user must have **all** (i.e. every single one) of the abilities listed.

```jsx
const AllAbilities = () => {
  const canViewSuperSecretMenu = useGate({
    all: ["admin", "super_secret_menu_admin"],
  });

  if (!canViewSuperSecretMenu) {
    return <p>You can't view the super secret menu.</p>;
  }

  return (
    <div>
      <h1>Super Secret Menu</h1>
      <Gate
        ability={{ all: ["admin", "super_secret_menu_admin", "super_secret_menu_admin_editor"] }}
      >
        <button>Edit</button>
      </Gate>
    </div>
  );
};
```

### Providing a custom `satisfies` function

We suggest you pass an array of strings to `<GateProvider />` and then matching strings to `<Gate />` and `useGate`. If you would like, you could provide for example an array of objects like your `Permission` model and then check against the permission name in your application. By default we compare the required ability and the abilities the user has with `Object.is()` but you can provide a custom `satisfies` function to perform the comparison however you want.

```jsx
const permissions = [
  { id: 1, name: "read docs" },
  { id: 2, name: "use this package" },
  { id: 3, name: "star this repo" },
  { id: 4, name: "give the author lots of praise" },
];

const App = () => {
  return (
    <GateProvider
      abilities={permissions}
      satisfies={(requiredPermission, permissionToTest) =>
        permissionToTest.name === requiredPermission
      }
    >
      {/* Rest of your app */}
    </GateProvider>
  );
};

const Example = () => {
  return (
    <div>
      <Gate ability={{ any: ["read docs", "use this package"] }}>
        This is the key to happiness.
      </Gate>
    </div>
  );
};
```

Note: TypeScript will give out to you because it wants `abilities` to be an array of strings but I promise it works. I just need to make those types generic!

This particular example isn't incredibly useful as you could just map the permissions to an array of names but providing a custom `satisfies` function can give a lot of flexbility. Such as...

### Implement wildcard abilities

Imagine in your application you have four abilities relating to posts:

- `posts.create`
- `posts.view`
- `posts.edit`
- `posts.delete`

Some applications allow wildcard abilities e.g. `posts.*` which allow the user to perform any of the abilities related to posts in this case.

We can use a custom `satisfies` function to implement this:

```jsx
const abilities = ["posts.create", "posts.view", "posts.edit", "posts.delete"];

const satisfiesIncludingWildcard = (requiredAbility, abilityToTest) => {
  if (abilityToTest.includes("*")) {
    return !!requiredAbility.match(
      new RegExp(abilityToTest.replaceAll(".", "\\.").replaceAll("*", ".*"))
    );
  }

  return requiredAbility === abilityToTest;
};

const App = () => {
  return (
    <GateProvider abilities={abilities} satisfies={satisfiesIncludingWildcard}>
      {/* Rest of your app */}
    </GateProvider>
  );
};

const Example = () => {
  return (
    <div>
      <Gate ability={{ any: ["read docs", "use this package"] }}>
        This is the key to happiness.
      </Gate>
    </div>
  );
};
```

This is just one way of implementing this, you can provide whatever `satisfies` function you want, or else don't provide one and use the default `Object.is()` comparison.

## Terminology

I've been using the terms _ability_, _permission_, and _privilege_ interchangeably in these docs. You can call them whatever you want that suits your application. If you perform authorisation checks using roles, permissions, privileges, or anything else you want you can use this library. You could even use this package for feature flags - it will work with anything where users have a list of something and you want to conditionally render UI based on the presence of one or more items in that list.

Don't like calling them gates? Re-export the components and hook with a custom name, you can even re-name the props if you want to refer to abilities as permissions:

```jsx
// In Permission.(js|ts)
import { GateProvider, Gate, useGate } from "@davekit/gate";

export const PermissionsProvider = ({ permissions, ...props }) => {
  return <GateProvider abilities={permissions} {...props} />;
};

export const Permission = ({ permission, ...props }) => {
  return <Gate ability={permission} {...props} />;
};

export const usePermission = (arg) => {
  if ("permission" in arg) {
    arg.ability = arg.permission;
    delete arg.permission;
  }

  return useGate(arg);
};
```
