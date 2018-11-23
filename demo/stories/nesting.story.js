import initAetherAccordion from "../../src";

export default () => ({
  html: `
    <dl class="level-1">
      <dt>Section 1</dt>
      <dd>
        <p>Section 1 Content...</p>
      </dd>
      <dt>Section 2</dt>
      <dd>
        <dl class="level-2">
          <dt>Section 1</dt>
          <dd>
            <p>Section 1 Content...</p>
          </dd>
          <dt>Section 2</dt>
          <dd>
            <dl class="level-3">
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
                <p>Section 3 Content...</p>
              </dd>
            </dl>
          </dd>
          <dt>Section 3</dt>
          <dd>
            <p>Section 3 Content...</p>
          </dd>
        </dl>
      </dd>
      <dt>Section 3</dt>
      <dd>
        <p>Section 3 Content...</p>
      </dd>
    </dl>
  `,
  init: () => {
    initAetherAccordion({ element: ".level-1" });
    initAetherAccordion({ element: ".level-2" });
    initAetherAccordion({ element: ".level-3" });
  }
});
