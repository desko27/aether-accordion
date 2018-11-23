import initAetherAccordion from "../../src";

export default () => ({
  html: `
    <dl>
      <dt>Section 1</dt>
      <dd>
        <p>Section 1 Content...</p>
      </dd>
      <dt>Section 2</dt>
      <dd>
        <p>Section 2 Content...</p>
      </dd>
      <dt>Section 3</dt>
      <dd>
        <p>Section 3 Content Section 3 Content Section 3 Content Section 3 Content Section 3 Content Section 3 Content Section 3 Content Section 3 Content Section 3 ContentSection 3 Content Section 3 Content Section 3 Content Section 3 Content Section 3 Content Section 3 Content Section 3 Content Section 3 Content Section 3 Content ...</p>
      </dd>
    </dl>
  `,
  init: () => {
    initAetherAccordion({ element: "dl" });
  }
});
