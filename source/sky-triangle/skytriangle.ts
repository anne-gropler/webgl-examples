
import { Camera, Context, NdcFillingTriangle, Program, Shader, TextureCube } from 'webgl-operate';

export class SkyTriangle {

    protected _context: Context;
    protected _camera: Camera;

    protected _triangle: NdcFillingTriangle;
    protected _texture: TextureCube;

    protected _program: Program;
    protected _uInverseViewProjection: WebGLUniformLocation;
    protected _uEye: WebGLUniformLocation;
    protected _uBackground: WebGLUniformLocation;


    initialize(context: Context, camera: Camera, texture: TextureCube): void {
        this._context = context;
        this._camera = camera;
        this._texture = texture;

        const gl = this._context.gl;

        const vert = new Shader(this._context, gl.VERTEX_SHADER, 'skytriangle.vert');
        vert.initialize(require('./skytriangle.vert'));
        const frag = new Shader(this._context, gl.FRAGMENT_SHADER, 'skytriangle.frag');
        frag.initialize(require('./skytriangle.frag'));

        this._program = new Program(this._context);
        this._program.initialize([vert, frag]);

        this._uInverseViewProjection = this._program.uniform('u_inverseViewProjection');
        this._uEye = this._program.uniform('u_eye');
        this._uBackground = this._program.uniform('u_background');

        this._triangle = new NdcFillingTriangle(this._context);
        const aVertex = this._program.attribute('a_vertex', 0);
        this._triangle.initialize(aVertex);
    }

    uninitialize(): void {
        this._uInverseViewProjection = -1;
        this._uEye = -1;
        this._uBackground = -1;

        this._program.uninitialize();
        this._triangle.uninitialize();
    }

    frame(): void {
        const gl = this._context.gl;

        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.enable(gl.DEPTH_TEST);
        gl.depthMask(false);
        gl.depthFunc(gl.LEQUAL);

        this._program.bind();
        gl.uniformMatrix4fv(this._uInverseViewProjection, gl.GL_FALSE, this._camera.viewProjectionInverse);
        gl.uniform3fv(this._uEye, this._camera.eye);
        gl.uniform1i(this._uBackground, 0);

        this._texture.bind(0);
        this._triangle.bind();
        this._triangle.draw();
        this._triangle.unbind();
        this._texture.unbind();

        this._program.unbind();

        gl.depthFunc(gl.LESS);
        gl.depthMask(true);
        gl.cullFace(gl.BACK);
        gl.disable(gl.CULL_FACE);
    }

}
