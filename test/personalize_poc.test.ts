import * as cdk from 'aws-cdk-lib';
import * as PersonalizePoc from '../lib/personalize_poc-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new PersonalizePoc.PersonalizePocStack(app, 'MyTestStack');
    // THEN
    const actual = app.synth().getStackArtifact(stack.artifactId).template;
    expect(actual.Resources ?? {}).toEqual({});
});
