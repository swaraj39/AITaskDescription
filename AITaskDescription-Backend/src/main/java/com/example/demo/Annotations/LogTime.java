package com.example.demo.Annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD}) // Can only be used on methods
@Retention(RetentionPolicy.RUNTIME) // Needed for runtime processing
public @interface LogTime {
    String value() default "";
}
