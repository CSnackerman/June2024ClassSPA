import html from "html-literal";

export const header = state => html`
  <header>
    <h1>${state.header}</h1>
  </header>
`;
