import * as React from "react";
import { prefix, connectEditorProps } from "../utils/utils";
import { IObject } from "@daybrush/utils";
import Memory from "../utils/Memory";
import Editor from "../Editor";
import { EditorInterface, ScenaJSXType } from "../types";

export interface Maker {
    tag: string;
    attrs: IObject<any>;
    style: IObject<any>;
}

@connectEditorProps
export default abstract class Icon extends React.PureComponent<{
    editor: Editor;
    selected?: boolean;
    onSelect?: (id: string) => any;
}> {
    public static id: string;
    public static maker?: (
        memory: Memory,
        style: React.CSSProperties
    ) => ScenaJSXType;
    public static makeThen: (
        target: HTMLElement | SVGElement
    ) => any = () => {};
    public keys: string[] = [];
    public abstract renderIcon(): any; 
    public render() {
        return (
            <div
                className={prefix(
                    "icon",
                    this.props.selected ? "selected" : ""
                )}
                onClick={this.onClick}
            >
                {this.renderIcon()} 
            </div>
        );
    } 
    public onClick = () => { 
        const onSelect = this.props.onSelect;

        if (onSelect) {
            onSelect((this.constructor as any).id);
        }
    }; 
    
    public componentDidMount() {
        const keys = this.keys;
        if (keys.length) {
            this.keyManager.keydown(
                keys,
                (e) => {
                    if (e.ctrlKey || e.metaKey) {
                        return false;
                    }
                    this.onClick();
                },
                (this.constructor as any).id
            );
        }
    }
}

export default interface Icon extends EditorInterface {}
