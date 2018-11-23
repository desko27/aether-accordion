import initAetherAccordion from "../../src";

export default () => ({
  html: `
    <dl class="level-1">
      <dt>You don't wanna go down... do you?</dt>
      <dd>
        <dl class="level-2">
          <dt>Nothing to be seen here</dt>
          <dd>
            <p>I told you!</p>
          </dd>
          <dt>Wanna go even deeper?</dt>
          <dd>
            <dl class="level-3">
              <dt>Oh yeah</dt>
              <dd>
                <p>Lorem ipsum</p>
              </dd>
              <dt>I just got tired</dt>
              <dd>
                <p>Lorem ipsum</p>
              </dd>
              <dt>Let's leave it here</dt>
              <dd>
                <p>Lorem ipsum</p>
              </dd>
            </dl>
          </dd>
        </dl>
      </dd>
      <dt>Keep calm</dt>
      <dd>
        <p>...and stay at the first level.</p>
      </dd>
    </dl>
  `,
  init: () => {
    initAetherAccordion({ element: ".level-1" });
    initAetherAccordion({ element: ".level-2" });
    initAetherAccordion({ element: ".level-3" });
  }
});
